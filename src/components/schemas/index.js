import * as Yup from "yup";

export const forgotPassword = Yup.object().shape({
    email: Yup.string()
      .email("Email should be a valid email")
      .required("Email is required"),
    // phoneNumber: Yup.string().required("Phone number is required"),
  });