import { useState } from "react";
import apinew from "@/utilities/apinew";
import { toast } from "react-hot-toast";
import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import api from "@/utilities/api";
import { getToken } from "@/utilities/localStorage";
import { useLocalStorage } from "@/helpers/localStorage/useLocalStorage";

const usePostData = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const { handleLogin, otpResetPassword, setShowOtpPopup, setPassword, setPopupController } =
    useAuthContext();

  const postData = async (url, payload, RequestType) => {
    // custom api call for sign in and signup
    if (RequestType === "signin" || RequestType === "signup") {
      try {
        setLoading(true);
        const res = await apinew.post(url, payload);
        if (res.data.success && RequestType === "signin") {
          localStorage.setItem("profile_info", JSON.stringify(res?.data?.data));
          localStorage.setItem("access", res?.data?.data?.access);

          if (
            res?.data?.data?.user?.practitionerType ||
            res?.data?.data?.user?.role === "Consumer"
          ) {
            handleLogin(res?.data?.data?.access);
            setLoading(false);
            router.push("/dashboard");
            toast.success("Welcome back!");
          } else {
            setLoading(false);
            setPractitionerDetails(true);
            router.push("/signup");
          }
        }

        setError(null);
      } catch (error) {
        if(RequestType === "signin") {
          if (error?.response?.data?.email_verified === false) {
            setShowOtpPopup(true);
            return;
          }
        }
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    //custom api call for changePasswrd, VERIFY_OTP_PASSWORD
    if (
      RequestType === "changePasswrd" ||
      RequestType === "VERIFY_OTP_PASSWORD"
    ) {
      try {
        setLoading(true);
        api.setJWT(getToken());
        const res = await api.post(url, payload);
        if (res.data.success && RequestType === "changePasswrd") {
          setPassword(payload.password);
          setLoading(false);
          setShowOtpPopup(true);
        }
        if (res.data.success && RequestType === "VERIFY_OTP_PASSWORD") {
          setLoading(false);
          // setPopupController(false);
          setShowOtpPopup(false);
        }
      } catch (error) {
        
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return { loading, error, data, postData };
};

export default usePostData;
