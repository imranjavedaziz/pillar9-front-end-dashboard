"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import InputField from "@/components/formElements/InputField";
import InputPassword from "@/components/formElements/InputPassword";
import InputPhone from "@/components/formElements/InputPhone";
import { useAuthContext } from "@/context/authContext";
import { signUpSchema } from "@/schema";
import { useFormik } from "formik";
import Link from "next/link";
import { useEffect, useState } from "react";
import test from "/public/test.jpg";
import test2 from "/public/test2.jpg";
import usePostData from "@/app/hooks/usePostData";
import { AUTH_REGISTER } from "@/utilities/endpoints";
import CodeVerifcationPopup from "@/components/popups/verifiationPopup";
import PractitionerForm from "@/components/dashboard/practitionerForm/PractitionerForm";
import SignupPopup from "@/components/popups/signupPopup/SignupPopup";
import apinew from "@/utilities/apinew";
import { toast } from "react-hot-toast";

const Signup = () => {
  const [loading, setLoading] = useState(false);

  const {
    showOtpPopup,
    role,
    email,
    setEmail,
    setShowOtpPopup,
    practitionerDetails,
    setRole,
  } = useAuthContext();

  // const { data, loading, postData, error } = usePostData();
  // const [showOtpPopup, setShowOtpPopup] = useState(false);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
  };

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: async function (values, action) {
      try {
        setLoading(true);
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          password: values.password,
          confirm_password: values.confirmPassword,
          role: role,
        };
        const res = await apinew.post(AUTH_REGISTER, payload);
        if (res.data.success) {
          setShowOtpPopup(true);
          toast.success("Welcome to Pillar 9! Please verify your email");
          setLoading(false);

          setEmail(values.email);
          action.resetForm();
        }
      } catch (error) {
        setLoading(false);
      }
    },
  });

  const [showPasswords, setShowPasswords] = useState({
    password1: false,
    password2: false,
  });

  const togglePasswordVisibility = (inputName) => {
    setShowPasswords({
      ...showPasswords,
      [inputName]: !showPasswords[inputName],
    });
  };

  const [showModal, setShowModal] = useState(
    practitionerDetails ? false : true
  );

  const handleButtonClick = (value) => {
    setRole(value);
    setShowModal(false);
  };

  return (
    <>
      {showOtpPopup && <CodeVerifcationPopup email={email} />}
      {showModal && <SignupPopup handleButtonClick={handleButtonClick} />}
      <div className="bg-blockchain-bg bg-no-repeat bg-cover h-screen overflow-auto text-black">
        {/* sign up --- container */}
        <div className="h-full md:grid md:grid-cols-2">
          {/* sign up  ------ left */}

          <div className="relative xs:hidden md:block text-center">
            <img
              src="/test2.jpg"
              className="w-full h-screen object-cover object-center"
              alt=""
            />
          </div>

          {/* sign up ------ right */}
          <div className="max-h-screen overflow-auto my-auto">
            <div>
              <h1 className="text-heading-xs sm:text-heading-sm lg:text-heading-lg mt-5   sm:leading-[44px] text-center">
                {!practitionerDetails
                  ? "User Registration"
                  : "Practitioner Details"}
              </h1>
            </div>
            {!practitionerDetails ? (
              <>
                <form
                  className="lg:w-[450px] pt-[30px] ss:w-[360px] sm:w-[380px] space-y-7 mx-auto"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label
                      className="text-label-md heading-3 sm:text-[1.2375em]"
                      htmlFor="FirstName"
                    >
                      Name
                    </label>

                    <div className="flex justify-between mt-2">
                      <div className="w-[46%]">
                        <InputField
                          inputType="text"
                          inputId="FirstName"
                          inputPlaceholder="First Name"
                          inputName="firstName"
                          inputValue={values.firstName}
                          inputOnChangeFunc={handleChange}
                          onBlur={handleBlur}
                          errorMsg={errors.firstName}
                          errors={errors.firstName}
                          touched={touched.firstName}
                        />
                      </div>
                      <div className="w-[46%]">
                        <InputField
                          inputType="text"
                          inputId="LastName"
                          inputPlaceholder="Last Name"
                          inputName="lastName"
                          inputValue={values.lastName}
                          inputOnChangeFunc={handleChange}
                          onBlur={handleBlur}
                          errorMsg={errors.lastName}
                          errors={errors.lastName}
                          touched={touched.lastName}
                        />
                      </div>
                    </div>
                  </div>

                  <InputField
                    inputType="email"
                    inputId="Email"
                    inputPlaceholder="mail@example.com"
                    inputName="email"
                    inputValue={values.email}
                    inputOnChangeFunc={handleChange}
                    onBlur={handleBlur}
                    errorMsg={errors.email}
                    labelName="Email"
                    errors={errors.email}
                    touched={touched.email}
                  />

                  <div>
                    <label className="text-label-md heading-3 sm:text-[1.2375em]">
                      Phone Number
                    </label>
                    <InputPhone
                      inputType="phone"
                      inputId="Phone Number"
                      inputPlaceholder="Phone number"
                      inputName="phoneNumber"
                      inputValue={values.phoneNumber}
                      inputOnChangeFunc={handleChange}
                      onBlur={handleBlur}
                      errorMsg={errors.phoneNumber}
                      labelName="Phone Number"
                      errors={errors.phoneNumber}
                      touched={touched.phoneNumber}
                      setFieldValue={setFieldValue}
                    />
                  </div>

                  <InputPassword
                    labelName="Password"
                    inputType={showPasswords.password1 ? "text" : "password"}
                    inputPlaceholder="Minimum of 8 characters"
                    inputValue={values.password}
                    inputOnChangeFunc={handleChange}
                    onBlur={handleBlur}
                    errorMsg={errors.password}
                    showPassFunch={togglePasswordVisibility}
                    showPassword={showPasswords.password1}
                    inputName="password"
                    password="password1"
                    errors={errors.password}
                    touched={touched.password}
                  />

                  <InputPassword
                    labelName="Confirm Password"
                    inputType={showPasswords.password2 ? "text" : "password"}
                    inputPlaceholder="Confirm Password"
                    inputValue={values.confirmPassword}
                    inputOnChangeFunc={handleChange}
                    onBlur={handleBlur}
                    errorMsg={errors.confirmPassword}
                    showPassFunch={togglePasswordVisibility}
                    showPassword={showPasswords.password2}
                    inputName="confirmPassword"
                    password="password2"
                    errors={errors.confirmPassword}
                    touched={touched.confirmPassword}
                  />

                  {/* <button
                    type="submit"
                    className="text-white cursor-pointer flex item-center justify-center gap-2"
                    style={{
                      background: "#e6d466",
                      borderRadius: "24px",
                      width: "100%",
                      border: 0,
                      padding: "10px",
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    Create Account
                    {loading ? <LoadingSpinner /> : null}
                  </button> */}
                  {role === "Consumer" ? (
                    <button
                      type="submit"
                      className="text-white cursor-pointer flex item-center justify-center gap-2"
                      style={{
                        background: "#e6d466",
                        borderRadius: "24px",
                        width: "100%",
                        border: 0,
                        padding: "10px",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      Create Account
                      {loading ? <LoadingSpinner /> : null}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="text-white cursor-pointer flex item-center justify-center gap-2"
                      style={{
                        background: "#e6d466",
                        borderRadius: "24px",
                        width: "100%",
                        border: 0,
                        padding: "10px",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      Next
                      {loading ? <LoadingSpinner /> : null}
                    </button>
                  )}

                  <div className="text-center pb-3">
                    <span className="mr-2 text-[10px] sm:text-[12px] lg:text-[14px]">
                      Already have an account?
                    </span>
                    <Link
                      className="text-secondary-purpleBlue font-semibold text-[10px] sm:text-[12px] lg:text-[14px]"
                      href="/"
                    >
                      Login
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <PractitionerForm />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
