"use client";

import CustomButton from "@/components/formElements/CustomButton";
import InputField from "@/components/formElements/InputField";
import { useAuthContext } from "@/context/authContext";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";

// images
import profilePicture from "/public/lisa.jpg";
import DisabledInputField from "@/components/formElements/DisabledInputField";
import CustomTextArea from "@/components/formElements/CustomTextArea";
import SelectInputField from "@/components/formElements/SelectInputField";
import ChangeImagePopup from "@/components/popups/ChangeImagePopup/ChangeImagePopup";
import api from "@/utilities/api";
import {
  EDIT_USER_PROFILE,
  GET_PROFILE_BY_USERID,
} from "@/utilities/endpoints";
import { getId, getToken } from "@/utilities/localStorage";
import { getStateAgainstCountry } from "@/utilities/countriesAndStatesApi";
import apinew from "@/utilities/apinew";
import { useLocalStorage } from "@/helpers/localStorage/useLocalStorage";

const ProfileDetails = () => {
  const { profileDetail, refetchFromLocalStorage, headshot, userRole, role } =
    useAuthContext();

  const [popupController, setPopupController] = useState(false);

  const [profileInfo, setProfileInfo] = useState({});
  const [statesAgainstCountry, setStatesAgainstCountry] = useState([]);
  const [userData, setUserData] = useState({});
  const [patchData, setPatchData] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    profileImage: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    practitionerType: "",
    bio: "",
    companyName: "",
    states: [
      {
        licenseNumber: "",
        state: "",
      },
    ],
  });

  useEffect(() => {
    setFormData({
      profileImage: userData ? userData.headshot : "",
      firstName: userData ? userData.firstName : "",
      lastName: userData ? userData.lastName : "",
      email: userData ? userData.email : "",
      phoneNumber: userData ? userData.phoneNumber : "",
      practitionerType: userData ? userData.practitionerType : "",
      bio: userData ? userData.bio : "",
      companyName: userData ? userData.companyName : "",
      states: userData ? userData.states : "",
    });
  }, [userData]);

  const getUserData = async () => {
    try {
      api.setJWT(getToken());
      const res = await api.get(`${GET_PROFILE_BY_USERID + getId()}`);
      if (res?.data?.success) {
        setUserData(res?.data?.data?.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const profile_info = JSON.parse(localStorage.getItem("profile_info"));
    setProfileInfo(profile_info);
  }, []);

  useEffect(() => {
    const getStates = async () => {
      setStatesAgainstCountry([]);
      const resStates = await getStateAgainstCountry(userData?.country);
      setStatesAgainstCountry(resStates);
    };
    if (userData?.country) {
      getStates();
    }
  }, [userData?.country]);

  useEffect(() => {
    const profile_img = JSON.parse(localStorage.getItem("profile_info"))?.user
      ?.headshot;

    if (typeof profile_img == "string" && profile_img?.length > 1) {
      setFormData((prev) => ({ ...prev, profileImage: profile_img }));
    }
  }, [refetchFromLocalStorage]);

  useEffect(() => {
    document.title='Edit Profile'
    getUserData();
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (profileDetail?.role === "Practitioner") {
      if (name === "licenseNumber") {
        setFormData((prevFormData) => {
          const updatedStates = [...prevFormData.states];
          updatedStates[index].licenseNumber = value;
          return { ...prevFormData, states: updatedStates };
        });
        setPatchData((prev) => ({ ...prev, states: formData.states }));
      } else if (name === "state") {
        setFormData((prevFormData) => {
          const updatedStates = [...prevFormData.states];
          updatedStates[index].state = value.value;
          return { ...prevFormData, states: updatedStates };
        });
        setPatchData((prev) => ({ ...prev, states: formData.states }));
      } else {
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        setPatchData((prev) => ({ ...prev, [name]: value }));
      }
    } else if (profileDetail?.role === "Consumer") {
      setFormData((prevData) => {
        return {
          ...prevData,
          [name]: value,
        };
      });
      setPatchData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalidStates = formData.states.filter(
      (item) => item.licenseNumber === "" || item.state === ""
    );

    if (invalidStates.length > 0) {
      if (
        invalidStates.some(
          (item) => item.licenseNumber === "" && item.state === ""
        )
      ) {
        toast.error("Please enter License Number and select the State.");
      } else if (invalidStates.some((item) => item.licenseNumber === "")) {
        toast.error("Please enter the License Number.");
      } else if (invalidStates.some((item) => item.state === "")) {
        toast.error("Please select a State.");
      }
    } else {
      try {
        apinew.setJWT(getToken());
        const res = await apinew.patch(
          `${EDIT_USER_PROFILE}/${getId()}`,
          patchData
        );
        if (res?.data?.success) {
          toast.success("Profile Edited Successfully!");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAddComponent = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      states: [
        ...prevFormData.states,
        {
          licenseNumber: "",
          state: "",
        },
      ],
    }));
  };

  useEffect(() => {
    // Initialize the 'option' state with the initial practitionerType value
    setOption(formData?.practitionerType || "");
  }, [formData?.practitionerType]);

  const [selectedPractitionerType, setSelectedPractitionerType] = useState("");

  const practitionerOptions = [
    { value: "agent/broker", label: "Real Estate Agent/Broker" },
    { value: "loan officer", label: "Loan Officer / Lender" },
    { value: "title/escrow", label: "Title / Settlement" },
    { value: "mortgage broker", label: "Mortgage Broker" },
    { value: "appraiser", label: "Appraiser" },
  ];

  // const [option, setOption] = useState(userData.practitionerType);
  const [option, setOption] = useState(formData?.practitionerType);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelected = (item) => {
    setSelectedPractitionerType(item);
  };

  const handleDropDown = (e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };
  return (
    <>
      {popupController && (
        <ChangeImagePopup setPopupController={setPopupController} />
      )}
      <div className="flex h-full min-h-screen">
        <div className="py-4 w-full px-10  ">
          <h1 className="text-4xl font-semibold text-black leading-[18px] sm:leading-[44px]">
            Settings
          </h1>

          <div className="bg-[#e6d466] mt-5  p-[1px] rounded-[24px] ">
            <div className="w-full bg-white py-10 px-[12%] lg:px-[201px] xl:px-[250px] rounded-[24px] text-black">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="text-center">
                  <h1 className=" text-3xl font-semibold leading-[18px] sm:leading-[44px]">
                    Profile Details
                  </h1>

                  <div className="relative w-fit mx-auto my-3 border-solid border-[1px]  border-[#e6d466] rounded-full">
                    <img
                      className="w-[160px] h-[160px] rounded-full"
                      src={
                        profileDetail.headshot
                          ? profileDetail.headshot
                          : "/lisa.jpg"
                      }
                      alt=""
                    />
                    <div className="bottom-[-0.5rem] right-7 absolute w-10 h-10 rounded-full flex justify-center items-center bg-slate-200 cursor-pointer">
                      <span
                        className="material-icons"
                        onClick={() => {
                          setPopupController(true);
                        }}
                      >
                        edit
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <div>
                    <label
                      className="text-label-md leading-3 sm:text-[1.2375em] sm:leading-[1.4375em]"
                      htmlFor="FirstName"
                    >
                      Name
                    </label>

                    <div className="flex justify-between gap-2 sm:gap-4">
                      <div className="w-[50%]">
                        <InputField
                          inputType="text"
                          inputId="FirstName"
                          inputPlaceholder="First Name"
                          inputName="firstName"
                          inputValue={formData.firstName}
                          inputOnChangeFunc={handleChange}
                        />
                      </div>
                      <div className="w-[50%]">
                        <InputField
                          inputType="text"
                          inputId="LastName"
                          inputPlaceholder="Last Name"
                          inputName="lastName"
                          inputValue={formData.lastName}
                          inputOnChangeFunc={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {profileDetail?.role === "Practitioner" ? (
                  <InputField
                    inputType="email"
                    inputId="email"
                    inputPlaceholder={userData?.email}
                    inputName="email"
                    inputValue={formData?.email}
                    labelName="Email Address"
                    inputOnChangeFunc={handleChange}
                  />
                ) : (
                  <DisabledInputField
                    inputType="email"
                    inputId="email"
                    inputPlaceholder={userData?.email}
                    inputName="email"
                    inputValue={formData?.email}
                    labelName="Email Address"
                    inputOnChangeFunc={handleChange}
                  />
                )}

                {profileInfo?.user?.role === "Practitioner" ? (
                  <InputField
                    inputType="text"
                    inputId="text"
                    inputPlaceholder={"+" + 15383678422}
                    inputName="phoneNumber"
                    labelName="Phone Number"
                    inputValue={formData?.phoneNumber}
                    inputOnChangeFunc={handleChange}
                  />
                ) : (
                  <DisabledInputField
                    inputType="text"
                    inputId="text"
                    inputPlaceholder={"+" + 15383678422}
                    inputName="phoneNumber"
                    labelName="Phone Number"
                    inputValue={formData?.phoneNumber}
                    inputOnChangeFunc={handleChange}
                  />
                )}

                {profileInfo?.user?.role === "Practitioner" && (
                  <>
                    {/* <DisablesInputField
                      inputType="text"
                      inputId="text"
                      inputName="practitionerType"
                      labelName="Practitioner:"
                      inputValue={formData?.practitionerType}
                      initialValue={formData.practitionerType}
                      inputOnChangeFunc={handleChange}
                    /> */}

                    <div className="space-y-1.5">
                      <label className="text-label-md heading-3 sm:text-[1.2375em] text-white">
                        Practitioner
                      </label>
                      <div className="bg-primary p-0.5 rounded-[24px] relative">
                        <button
                          onClick={handleDropDown}
                          className="flex items-center justify-between w-full rounded-[24px] border-0 bg-white px-3 py-2 cursor-pointer  text-black"
                          style={{ zIndex: -2 }}
                        >
                          {option}
                          {isOpen ? (
                            <span className="material-icons">
                              arrow_drop_up
                            </span>
                          ) : (
                            <span className="material-icons">
                              arrow_drop_down
                            </span>
                          )}
                        </button>
                        {isOpen && (
                          <ul
                            className="absolute py-2 bg-white  w-[95%] left-3  list-none rounded-[8px] shadow-lg shadow-black/0.5 max-h-[250px]"
                            style={{ zIndex: 1, overflowY: "scroll" }}
                          >
                            {practitionerOptions?.map((item, ind) => (
                              <li
                                key={ind}
                                className={`px-3 cursor-pointer text-black ${
                                  selectedPractitionerType === item.value
                                    ? "bg-primary/50"
                                    : "hover:bg-primary/70"
                                }  text-[12px] sm:text-[14px]`}
                                onClick={(e) => {
                                  handleDropDown(e);
                                  setOption(item.label);
                                  handleSelected(item);
                                  setPatchData((prev) => ({
                                    ...prev,
                                    practitionerType: item.value,
                                  })); // Update patchData with selected practitioner type
                                }}
                              >
                                {item.label}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <CustomTextArea
                      inputType="text"
                      inputId="Bio"
                      padding="py-10"
                      inputName="bio"
                      labelName="Bio"
                      inputValue={formData?.bio}
                      inputOnChangeFunc={handleChange}
                    />

                    <InputField
                      inputType="text"
                      inputId="BusinessName"
                      inputPlaceholder="Business Name"
                      inputName="companyName"
                      labelName="Business Name"
                      inputValue={formData?.companyName}
                      inputOnChangeFunc={handleChange}
                    />

                    {formData &&
                      formData?.states?.map((item, i) => {
                        return (
                          <div
                            key={i}
                            className="grid grid-cols-2 items-center gap-1 sm:gap-3 md:gap-5"
                          >
                            <div className="">
                              <InputField
                                inputType="text"
                                inputId={`licenseNumber_${i + 1}`}
                                inputName="licenseNumber"
                                labelName={`License Number ${i + 1}`}
                                inputPlaceholder="EF12347658234"
                                inputValue={item.licenseNumber}
                                inputOnChangeFunc={(e) => handleChange(e, i)}
                              />
                            </div>
                            <div className="">
                              <SelectInputField
                                labelName="State/Province"
                                dropdownList={statesAgainstCountry}
                                initialValue={item.state || "Select State"}
                                selected={item.state}
                                setSelected={(value) =>
                                  handleChange(
                                    { target: { name: "state", value } },
                                    i
                                  )
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                    <button
                      className=" border-primary border-solid border-2 rounded-full ms-auto text-[1.7rem] leading-[0px] cursor-pointer flex justify-center items-center w-[35px] aspect-square bg-black/0 text-black"
                      type="button"
                      onClick={handleAddComponent}
                    >
                      +
                    </button>
                  </>
                )}

                {/* <InputField
                  inputType="email"
                  inputId="email"
                  inputPlaceholder={"john@email.com"}
                  inputName="lastName"
                  inputValue={formData?.email}
                  labelName="Email Address"
                />

                <InputField
                  inputType="text"
                  inputId="text"
                  inputPlaceholder={"+" + 15383678422}
                  inputName="PhoneNumber"
                  labelName="Phone Number"
                  inputValue={formData?.phoneNumber}
                />

                {role === "Practitioner" && (
                  <>
                    <InputField
                      inputType="text"
                      inputId="text"
                      inputName="practitionerType"
                      labelName="Practitioner:"
                      inputValue={formData?.practitionerType}
                      initialValue={formData.practitionerType}
                      inputOnChangeFunc={handleChange}
                    />

                    <CustomTextArea
                      inputType="text"
                      inputId="Bio"
                      padding="py-10"
                      inputName="bio"
                      labelName="Bio"
                      inputValue={formData?.bio}
                      inputOnChangeFunc={handleChange}
                    />

                    <InputField
                      inputType="text"
                      inputId="BusinessName"
                      inputPlaceholder="Business Name"
                      inputName="companyName"
                      labelName="Business Name"
                      inputValue={formData?.companyName}
                      inputOnChangeFunc={handleChange}
                    />

                    {formData &&
                      formData?.states?.map((item, i) => {
                        return (
                          <div
                            key={i}
                            className="grid grid-cols-2 items-center gap-1 sm:gap-3 md:gap-5"
                          >
                            <div className="">
                              <InputField
                                inputType="text"
                                inputId={`licenseNumber_${i + 1}`}
                                inputName="licenseNumber"
                                labelName={`License Number ${i + 1}`}
                                inputPlaceholder="EF12347658234"
                                inputValue={item.licenseNumber}
                                inputOnChangeFunc={(e) => handleChange(e, i)}
                              />
                            </div>
                            <div className="">
                              <SelectInputField
                                labelName="State/Province"
                                dropdownList={statesAgainstCountry}
                                initialValue={item.state || "Select State"}
                                selected={item.state}
                                setSelected={(value) =>
                                  handleChange(
                                    { target: { name: "state", value } },
                                    i
                                  )
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                    <button
                      className=" text-black border-solid border-2 rounded-full ms-auto text-[1.7rem] leading-[0px] cursor-pointer flex justify-center items-center w-[35px] aspect-square bg-black/0 border-[#e6d466]"
                      type="button"
                      onClick={handleAddComponent}
                    >
                      +
                    </button>
                  </>
                )} */}
                <br />
                <CustomButton
                  text="Save Settings"
                  px="sm:px-2.5"
                  py="sm:py-2 md:py-2.5"
                  fsSm="sm:text-[0.95rem]"
                  fsMd="md:text-[1.15rem]"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
