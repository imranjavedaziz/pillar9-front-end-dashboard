"use client";

import { useFormik } from "formik";
import React, { useState } from "react";

import { forgotPassword } from "../../schemas";

import InputField from "@/components/formElements/InputField";
import CustomButton from "@/components/formElements/CustomButton";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authContext";
import apinew from "@/utilities/apinew";
import { VERIFY_OTP, VERIFY_OTP_MFA } from "@/utilities/endpoints";
import { toast } from "react-hot-toast";

function OtpVerification({ setOtpResetPassword }) {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [code, setCode] = useState("");
  const { email, setResetToken } = useAuthContext();

  const handleChange = (e) => {
    const { value } = e.target;
    setCode(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email: email,
      email_otp: code,
    };
    if (!payload.email_otp) {
      toast.error("Please Enter OTP to continue.");
      setloading(false);
      return;
    } else {
      apinew
        .post(VERIFY_OTP_MFA, payload)
        .then((res) => {
          toast.success(res?.data?.message);
          setloading(false);
          setOtpResetPassword(false);
          router.push("/auth/reset-password");
          setResetToken(res?.data?.reset_token);
        })
        .catch((err) => {
          setloading(false);
          console.log(err);
        });
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 ">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-7 sm:p-10 relative  w-[80%] sm:w-[380px] md:w-[571px] rounded-[24px] text-black "
        >
          <div
            onClick={() => {
              setOtpResetPassword(false);
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
            Please check your email, we have sent verification code to reset
            your password
          </p>
          <div className="mt-10 mb-5">
            <InputField
              inputType="number"
              inputId="Email OTP Number"
              inputPlaceholder="Enter Verification Code"
              inputName="email_otp"
              labelName="Verification Code"
              inputOnChangeFunc={handleChange}
              inputValue={code}
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

export default OtpVerification;
