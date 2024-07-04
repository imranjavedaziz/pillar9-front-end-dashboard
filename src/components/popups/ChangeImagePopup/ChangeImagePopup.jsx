"use client";

import CustomButton from "@/components/formElements/CustomButton";
import CustomFileUpload from "@/components/formElements/CustomFileUpload";
import { useAuthContext } from "@/context/authContext";
import api from "@/utilities/api";
import { EDIT_USER_PROFILE } from "@/utilities/endpoints";
import { getId, getToken } from "@/utilities/localStorage";
import { useState } from "react";

const ChangeImagePopup = ({ setPopupController }) => {
  const { setHeadshot, setDataResync } = useAuthContext();
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async () => {
    try {
      api.setJWT(getToken());
      const res = await api.patch(`${EDIT_USER_PROFILE}/${getId()}`, {
        headshot: imageUrl,
      });
      if (res?.data?.success) {
        setPopupController(false);
        setHeadshot(res?.data?.data?.headshot);
        setDataResync((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 ">
        <div className="bg-white p-7 sm:p-10 relative  w-[80%] sm:w-[380px] md:w-[571px] rounded-[24px] text-black ">
          {/* cross icon */}

          <div
            onClick={() => {
              setPopupController(false);
            }}
          >
            <span
              className="material-icons cursor-pointer absolute right-4 sm:right-4 top-[1rem] sm:top-[1rem]"
              style={{ fontSize: "2rem" }}
            >
              close
            </span>
          </div>

          <h2 className="text-heading-xs sm:text-heading-sm md:text-heading-lg font-semibold ">
            Profile Photo
          </h2>

          <p className="text-[10px] sm:text-[15px] md:text-xl my-3">
            Please upload profile photo to update your Headshot
          </p>
          <div className="mx-10 mt-5">
            <CustomFileUpload
              labelName="Headshot:"
              grayText="Files types supported: JPG, PNG Max Size: 5MB"
              formId={1}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              borderRadius=" "
              maxFileSize={5}
            />

            <div
              className="sm:gap-8 mt-5 sm:mt-14"
              onClick={() => {
                handleSubmit();
              }}
            >
              <CustomButton text="Update Headshot" py="sm:py-2.5" />
            </div>
          </div>

          <div></div>
        </div>
      </div>
    </>
  );
};

export default ChangeImagePopup;
