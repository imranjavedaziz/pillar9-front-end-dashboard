"use client";

import { useFormik } from "formik";
import React, { useState } from "react";

import { forgotPassword } from "../../schemas";

import InputField from "@/components/formElements/InputField";
import CustomButton from "@/components/formElements/CustomButton";
import { useAuthContext } from "@/context/authContext";
import { FORGET_PASSWORD } from "@/utilities/endpoints";
import api from "@/utilities/api";

function ForgotPwd({ setIsForgotPassword, setOtpResetPassword }) {
  const initialValues = {
    email: "",
  };

  const { setEmail } = useAuthContext();

  const [loading, setloading] = useState(false);
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: forgotPassword,
      onSubmit: async (values, action) => {
        try {
          const payload = {
            email: values.email,
          };
          setloading(true);
          const res = await api.post(FORGET_PASSWORD, payload);
          if (res?.data?.success) {
            setEmail(values.email);
            setIsForgotPassword(false);
            setOtpResetPassword(true);
            setloading(false);
          }
        } catch (error) {
          setloading(false);
          console.log(error);
        }
      },
    });

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 ">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-7 sm:p-10 relative  w-[80%] sm:w-[380px] md:w-[571px] rounded-[24px] text-black "
        >
          <div
            onClick={() => {
              setIsForgotPassword(false);
            }}
          >
            <span
              className="material-icons sm:w-[22px] sm:h-[22px] absolute right-8 sm:right-10 top-[2rem] sm:top-[3.5rem] font-bold cursor-pointer"
              style={{ width: "2rem", height: "2rem", fontWeight: "bold" }}
            >
              close
            </span>
          </div>
          <h2 className="text-heading-xs sm:text-heading-sm md:text-heading-lg font-semibold ">
            Reset Password
          </h2>
          <p className=" text-[10px] sm:text-[15px] md:text-xl my-3">
            Please enter your email address and we will email you a verification
            code to reset your password.
          </p>
          <div className="mt-10 mb-5">
            <InputField
              inputType="email"
              inputId="Email"
              inputPlaceholder="mail@example.com"
              inputName="email"
              labelName="Email Address"
              inputValue={values.email}
              inputOnChangeFunc={handleChange}
              onBlur={handleBlur}
              errorMsg={errors.email}
              errors={errors.email}
              touched={touched.email}
            />
          </div>

          <div className="sm:gap-8 mt-5 sm:mt-14">
            <CustomButton
              text="Send Request"
              type="submit"
              isLoading={loading ? true : null}
              py="sm:py-2.5"
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default ForgotPwd;
