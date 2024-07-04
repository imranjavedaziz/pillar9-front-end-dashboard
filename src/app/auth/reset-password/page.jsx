"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import InputPassword from "@/components/formElements/InputPassword";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/formElements/CustomButton";
import { useAuthContext } from "@/context/authContext";
import api from "@/utilities/api";
import { RESET_PASSWORD } from "@/utilities/endpoints";

const Page = () => {
  
  const router = useRouter();

  const { setResetToken, resetToken } = useAuthContext();
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setloading] = useState(false);
  const [forgotPwdPopup, setforgotPwdPopup] = useState(false);
  const initialValues = {
    email: "",
    password: "",
  };

  // const searchParams = useSearchParams();
  // const reset_token = searchParams.get("reset_token");

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
      onSubmit: async function (values, action) {
        try {
          setloading(true);
          const payload = {
            password: values.password,
            confirm_password: values.confirm_password,
          };
          const res = await api.post(`${RESET_PASSWORD + resetToken}`, payload);
          if (res?.data?.success) {
            setResetToken(null);
            router.push("/");
          } else {
            setloading(false);
          }
        } catch (error) {
          if (error?.response?.data?.email_verified === false) {
            setloading(false);
            setEmail(values.email);
            setShowOtpPopup(true);
            return;
          }
          console.log(error);
          setloading(false);
        }
      },
    });

  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirm_password: false,
  });

  const togglePasswordVisibility = (inputName) => {
    setShowPasswords({
      ...showPasswords,
      [inputName]: !showPasswords[inputName],
    });
  };
  return (
    <>
      <div className="h-screen overflow-auto">
        {/* login --- container */}
        <div className="flex h-full max-w-[90%] mx-auto md:max-w-full">
          {/* login ------ left */}
          <div className="flex-1 flex justify-center items-center flex-col gap-6 text-black">
            <h1 className="text-[2.5rem] font-bold  leading-[49px] text-center">
              Reset Your Password
            </h1>

            <form onSubmit={handleSubmit} className="w-[70%] space-y-7">
              <InputPassword
                labelName="Password"
                inputType={showPasswords.password ? "text" : "password"}
                inputPlaceholder="Minimum of 8 characters"
                inputValue={values.password}
                inputOnChangeFunc={handleChange}
                onBlur={handleBlur}
                errorMsg={errors.password}
                showPassFunch={togglePasswordVisibility}
                showPassword={showPasswords.password}
                inputName="password"
                password="password"
                errors={errors.password}
                touched={touched.password}
              />

              <InputPassword
                labelName="Confirm Password"
                inputType={showPasswords.confirm_password ? "text" : "password"}
                inputPlaceholder="Minimum of 8 characters"
                inputValue={values.confirm_password}
                inputOnChangeFunc={handleChange}
                onBlur={handleBlur}
                errorMsg={errors.confirm_password}
                showPassFunch={togglePasswordVisibility}
                showPassword={showPasswords.confirm_password}
                inputName="confirm_password"
                password="confirm_password"
                errors={errors.confirm_password}
                touched={touched.confirm_password}
              />
              <div>
                <div className="mt-2.5">
                  <CustomButton
                    text="Reset Password"
                    type="submit"
                    isLoading={loading ? true : null}
                  />
                </div>
              </div>
            </form>
          </div>
          {/* login ------ right */}
          <div className="w-[50%] h-full md:flex justify-center items-center hidden">
            <img
              src="/test2.jpg"
              className="w-full h-full object-cover object-center"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
