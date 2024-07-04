"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import CustomButton from "@/components/formElements/CustomButton";
import { BASE_URL, RESEND_OTP, VERIFY_OTP_PASSWORD } from "@/utilities/endpoints";
import usePostData from "@/app/hooks/usePostData";
import { useAuthContext } from "@/context/authContext";
import axios from "axios";

const ChangePasswordVerification = () => {
  const { password, popupController, setPopupController, email } = useAuthContext();
  console.log(password);

  const { postData, loading } = usePostData();
  const [code, setCode] = useState("");

  const handleSubmitOtpp = async (event) => {
    event.preventDefault();

    const payload = {
      password,
      otp: code,
      otp_type: "Email",
    };
    postData(VERIFY_OTP_PASSWORD, payload, "VERIFY_OTP_PASSWORD");
  };

  const resendOtpCode = (event) => {
    event.preventDefault();

    // Form submission logic
    
    const url = BASE_URL + RESEND_OTP;
    const headers = { "Content-Type": "application/json" };
    const otpData = {
      email: email,
    };

    axios
      .post(url, otpData, { headers })
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      {popupController && (
        <form
          onSubmit={handleSubmitOtpp}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 "
        >
          <div className="bg-white p-7 sm:p-10 relative  w-[80%] sm:w-[380px] md:w-[571px] rounded-[24px] text-black ">
            {/* cross icon */}

            <div
              onClick={() => {
                setPopupController(false);
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
              Verification Code
            </h2>

            <p className=" text-[10px] sm:text-[15px] md:text-xl my-3">
              Verification email has been sent to your email
            </p>
            <div className="mt-8">
              <div className="bg-primary p-[2px] rounded-[24px] ">
                <div className="bg-white rounded-[24px] flex">
                  <input
                    className="w-full py-2.5 xl:py-3 px-4 bg-white border-0 rounded-[24px] placeholder:text-black placeholder:opacity-60 text-black focus:outline-none text-[13px] sm:text-[16px]"
                    type="number"
                    name="verificationCode"
                    id="verificationCode"
                    placeholder="Enter Code"
                    onChange={(event) => {
                      setCode(event.target.value);
                    }}
                  />
                  <button
                    type="button"
                    className="cursor-pointer text-[10px] bg-[transparent] font-semibold sm:text-[12px] text-black whitespace-nowrap my-auto pr-4 border-0"
                    onClick={resendOtpCode}
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            </div>
            <div className="sm:gap-8 mt-5 sm:mt-14">
              <CustomButton
                type="submit"
                text="Send Request"
                py="sm:py-2.5"
                isLoading={loading ? true : null}
              />
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default ChangePasswordVerification;
