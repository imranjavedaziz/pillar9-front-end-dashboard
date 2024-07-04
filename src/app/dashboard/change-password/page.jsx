"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import InputPassword from "@/components/formElements/InputPassword";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import ChangePasswordVerification from "@/components/popups/verifiationPopup/changePasswordVerification";
import { CHANGE_PASSWORD } from "@/utilities/endpoints";
import usePostData from "@/app/hooks/usePostData";
import { useAuthContext } from "@/context/authContext";

const ChangePassword = () => {
  useEffect(()=> {
    document.title='Change Password'
  },[])
  const { showOtpPopup } = useAuthContext();

  const { postData, loading } = usePostData();

  const [showPasswords, setShowPasswords] = useState({
    password1: false,
    password2: false,
    password3: false,
  });

  const togglePasswordVisibility = (inputName) => {
    setShowPasswords({
      ...showPasswords,
      [inputName]: !showPasswords[inputName],
    });
  };

  const initialValues = {
    current_password: "",
    password: "",
    confirm_password: "",
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: Yup.object().shape({
        password: Yup.string()
          .required("Password is required.")
          .min(8, "Password must be at least 8 characters long."),
        confirm_password: Yup.string()
          .required("Confirm password is required.")
          .oneOf([Yup.ref("password"), null], "Passwords do not match."),
      }),
      onSubmit: async (values, action) => {
        const payload = {
          current_password: values.current_password,
          password: values.password,
          confirm_password: values.confirm_password,
        };

        postData(CHANGE_PASSWORD, payload, "changePasswrd");
        action.resetForm();
      },
    });

  return (
    <>
      {showOtpPopup && <ChangePasswordVerification />}
      <div className="flex h-full min-h-screen">
        <div className="py-4 w-full px-10  ">
          <h1 className="text-heading-xs sm:text-heading-sm lg:text-heading-lg  leading-[18px] sm:leading-[44px]">
            Settings
          </h1>

          <div className="bg-[#e6d466] mt-5  p-[1px] rounded-[24px] ">
            <div className="w-full bg-white py-10 px-[12%] lg:px-[201px] xl:px-[250px] rounded-[24px] text-black">
              <form
                className="flex flex-col gap-5 max-w-[700px] mx-auto"
                onSubmit={handleSubmit}
              >
                <div className="text-center">
                  <h1 className="text-heading-xs sm:text-heading-sm lg:text-heading-lg  leading-[18px] sm:leading-[44px]">
                   Change Password
                  </h1>
                </div>

                <InputPassword
                  labelName="Current Password"
                  inputType={showPasswords.password1 ? "text" : "password"}
                  inputPlaceholder="Entry Your Current Password"
                  showPassFunch={togglePasswordVisibility}
                  showPassword={showPasswords.password1}
                  inputName="current_password"
                  inputValue={values.current_password}
                  inputOnChangeFunc={handleChange}
                  onBlur={handleBlur}
                  errorMsg={errors.current_password}
                  errors={errors.current_password}
                  touched={touched.current_password}
                  password="password1"
                />

                <InputPassword
                  labelName="New Password"
                  inputType={showPasswords.password2 ? "text" : "password"}
                  inputPlaceholder="Entry New Current Password"
                  showPassFunch={togglePasswordVisibility}
                  showPassword={showPasswords.password2}
                  password="password2"
                  inputName="password"
                  inputValue={values.password}
                  inputOnChangeFunc={handleChange}
                  onBlur={handleBlur}
                  errorMsg={errors.password}
                  errors={errors.password}
                  touched={touched.password}
                />

                <InputPassword
                  labelName="Confirm New Password"
                  inputType={showPasswords.password3 ? "text" : "password"}
                  inputPlaceholder="Confirm Your New Current Password"
                  showPassFunch={togglePasswordVisibility}
                  showPassword={showPasswords.password3}
                  password="password3"
                  inputName="confirm_password"
                  inputValue={values.confirm_password}
                  inputOnChangeFunc={handleChange}
                  onBlur={handleBlur}
                  errorMsg={errors.confirm_password}
                  errors={errors.confirm_password}
                  touched={touched.confirm_password}
                />

                <br />

                <button
                  type="submit"
                  className="text-white bg-[#e6d466] hover:bg-[#e2d684] cursor-pointer flex item-center justify-center gap-2"
                  style={{
                    borderRadius: "24px",
                    width: "100%",
                    border: 0,
                    padding: "10px",
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  Change Password
                  {loading ? <LoadingSpinner /> : null}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
