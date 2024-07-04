"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import CustomButton from "@/components/formElements/CustomButton";
import { VERIFY_OTP } from "@/utilities/endpoints";
import apinew from "@/utilities/apinew";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authContext";
import { useLocalStorage } from "@/helpers/localStorage/useLocalStorage";

const CodeVerifcationPopup = ({ email }) => {
  const { setShowOtpPopup, setPractitionerDetails, handleLogin } =
    useAuthContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSubmitOtpp = async (e) => {
    setLoading(true);
    e.preventDefault();
    const payload = {
      email: email,
      otp: code,
      otp_type: "Email",
    };
    if (!payload.otp) {
      toast.error("Please Enter OTP to continue.");
      setLoading(false);
      return;
    } else {
      apinew
        .post(VERIFY_OTP, payload)
        .then((res) => {
          localStorage.setItem("access", res?.data?.access);
          localStorage.setItem("profile_info", JSON.stringify(res?.data?.data));

          toast.success(res?.data?.message);
          setLoading(false);
          setShowOtpPopup(false);

          if (
            res?.data?.data?.user?.role === "Practitioner" &&
            !res.data?.data?.user?.practitionerType
          ) {
            setPractitionerDetails(true);
            router.push("/auth/signup");
          } else {
            handleLogin(res?.data?.access);
            router.push("/dashboard");
          }
        })

        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  return (
    <>
      <form
        //   onSubmit={handleSubmitOtp}
        onSubmit={handleSubmitOtpp}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 "
      >
        <div className="bg-white p-7 sm:p-10 relative  w-[80%] sm:w-[380px] md:w-[571px] rounded-[24px] text-black ">
          {/* cross icon */}

          <div
            onClick={() => {
              setShowOtpPopup(false);
            }}
          >
            {/* <img
                src="/assets/icons/cross.svg"
                alt=""
                className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] absolute right-8 sm:right-10 top-[2rem] sm:top-[3.5rem] cursor-pointer "
              /> */}
            <span
              className="material-icons sm:w-[22px] sm:h-[22px] absolute right-3  top-4  font-bold cursor-pointer"
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
              <div className="bg-primary rounded-[24px] flex">
                <input
                  className="w-full py-2.5 xl:py-3 px-4  border-0 rounded-[24px] placeholder:text-black placeholder:opacity-60 text-black focus:outline-none text-[13px] sm:text-[16px]"
                  type="number"
                  name="verificationCode"
                  id="verificationCode"
                  placeholder="Enter Code"
                  onChange={(event) => {
                    setCode(event.target.value);
                  }}
                />
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
    </>
  );
};

export default CodeVerifcationPopup;
