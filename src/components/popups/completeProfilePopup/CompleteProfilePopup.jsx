import CustomButton from "@/components/formElements/CustomButton";
import CustomFileUpload from "@/components/formElements/CustomFileUpload";
import CustomTextArea from "@/components/formElements/CustomTextArea";
import { useAuthContext } from "@/context/authContext";
import api from "@/utilities/api";
import apinew from "@/utilities/apinew";
import { EDIT_USER_PROFILE } from "@/utilities/endpoints";
import { getId, getToken } from "@/utilities/localStorage";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const CompleteProfilePopup = ({ setControlProfileForm }) => {
  const { setHeadshot, headshot, setDataResync, userRole, profileDetail } =
    useAuthContext();

  const [bio, setBio] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [formData, setFormData] = useState({
    bio: "",
    licenseSince: "",
    headshot: "",
  });

  useEffect(() => {
    setFormData({
      bio,
      headshot: imageUrl,
      licenseSince: selectedDate,
    });
  }, [imageUrl, formData?.bio, selectedDate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!imageUrl && !headshot) {
      return toast.error("Please Upload Profile Photo");
    }
    if (userRole === "Practitioner") {
      if (!bio) {
        return toast.error("Bio field must be filled!");
      }
      if (!selectedDate) {
        return toast.error("Date field must be filled!");
      }
    }
    // Remove the empty property
    Object.keys(formData).forEach((key) => {
      if (
        formData[key] === "" ||
        formData[key] === null ||
        formData[key]?.length === 0
      ) {
        delete formData[key];
      }
    });

    try {
      setLoading(true);
      api.setJWT(getToken());
      const res = await api.patch(
        EDIT_USER_PROFILE +
          "/" +
          JSON.parse(localStorage.getItem("profile_info"))?.user?.id,
        formData
      );
      if (res?.data?.success) {
        setDataResync((prev) => !prev);
        setHeadshot(res?.data?.data?.headshot);
        setLoading(false);
        setControlProfileForm(false);
      }
    } catch (error) {
      console.log("fail", false);
      setLoading(false);
    }
  };

  // const handleChange =(e)=> {

  //   const {name, value} = e.target;

  //   if(userRole === 'Practitioner') {
  //     setFormData((prev) => {return{
  //       ...prev,
  //       [name]:value
  //     }})
  //   }
  // }

  return (
    <div>
      {" "}
      <form
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        onSubmit={handleSubmit}
      >
        <div className=" max-h-[600px] xl:max-h-[700px] relative overflow-auto bg-white p-7 sm:p-10  w-[300px] sm:w-[380px] md:w-[571px] rounded-[24px] text-black ">
          <div
            onClick={() => setControlProfileForm(false)}
            className="w-[40px] h-[40px] absolute top-3 right-3"
          >
            <span
              className="material-icons cursor-pointer"
              style={{ fontSize: "2rem" }}
            >
              close
            </span>
          </div>
          <h2 className="text-heading-xs sm:text-heading-sm md:text-heading-lg font-semibold ">
            Complete Profile
          </h2>
          <p className=" text-[10px] sm:text-[15px] md:text-xl my-3">
            {`Please complete your Consumer profile to start minting NFTs`}
          </p>

          {profileDetail?.role === "Practitioner" && (
            <div className="my-10">
              <CustomTextArea
                inputType="text"
                inputId="bio"
                padding="py-10"
                inputName="bio"
                labelName="Bio:"
                value={bio}
                inputOnChangeFunc={(e) => {
                  setBio(e.target.value);
                }}
              />
            </div>
          )}

          <div className="my-10">
            <CustomFileUpload
              labelName="Headshot:"
              grayText="Files types supported: JPG, PNG, PDF, Max Size: 5MB"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              formId={99}
              maxFileSize={5}
            />
          </div>

          {profileDetail?.role === "Practitioner" &&
            !profileDetail.licenseSince && (
              <div className={`${headshot && "mt-5"} `}>
                <label
                  htmlFor=""
                  className=" text-[14px] sm:md:text-[16px] font-medium text-black"
                >
                  License Since Date:
                </label>
                <div
                  className=" p-0.5 mt-2 rounded-[24px]"
                  style={{ border: "2px solid #e6d466" }}
                >
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyy"
                    showYearDropdown
                    scrollableMonthYearDropdown
                    placeholderText="DD/MM/YYYY"
                    className="w-full border-0 outline-none text-black px-4 py-3 bg-white rounded-[24px] placeholder:font-medium focus:outline-none text-[13px]"
                  />
                </div>
              </div>
            )}
          <div></div>

          <div className="flex justify-center gap-4 sm:gap-8 mt-5 sm:mt-14">
            <CustomButton
              text="Complete Profile"
              px="sm:px-2.5"
              py="sm:py-3 md:py-4"
              fsSm="sm:text-[1rem]"
              type="submit"
              fsMd="md:text-[1.25rem]"
              isLoading={loading}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompleteProfilePopup;
