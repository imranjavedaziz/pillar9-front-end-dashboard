"use client";

import { useLocalStorage } from "@/helpers/localStorage/useLocalStorage";
import { BASE_URL, GET_PROFILE_BY_USERID } from "@/utilities/endpoints";
import { getId, getToken } from "@/utilities/localStorage";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [role, setRole] = useState("Consumer");
  const [email, setEmail] = useState("");
  const [practitionerDetails, setPractitionerDetails] = useState(false);
  const [profileDetail, setProfileDetail] = useState("");
  const [refetchFromLocalStorage, setRefetchFromLocalStorage] = useState(false);
  const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false);
  const [successData, setSuccessData] = useState("");
  const [openVerificationSuccess, setOpenVerificationSuccess] = useState(false);
  const [openVerificationFailure, setOpenVerificationFailure] = useState(false);
  const [editNftData, setEditNftData] = useState(null);
  const [otpResetPassword, setOtpResetPassword] = useState(false);
  const [liveStripe, setLiveStripe] = useState({});
  const [stripe, setStripe] = useState({});
  const [headshot, setHeadshot] = useState("");
  const [editPractitionerNftData, setEditPractitionerNftData] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(null);
  const [resetToken, setResetToken] = useState(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [popupController, setPopupController] = useState(true);
  const [videoPopup, setVideoPopup] = useState(null);
  const [dataResync, setDataResync] = useState(false);
  const [pendingNftData, setPendingNftData] = useState(null);
  const [minting, setMinting] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState({});

  let isLoggedIn = false;
  useEffect(() => {
    isLoggedIn = localStorage.getItem("isLoggedIn");
  }, []);

  const [navigate, setNavigate] = useState(isLoggedIn ? true : false);

  function handleLogin() {
    localStorage.setItem("isLoggedIn", true);
    setNavigate(true);
  }

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("profile_info");
    localStorage.removeItem("access");
    setNavigate(false);
  }

  useEffect(() => {
    const axiosInstance = axios.create({
      baseURL: BASE_URL,
    });

    axiosInstance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${getToken()}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axiosInstance
      .get(GET_PROFILE_BY_USERID + getId())
      .then((response) => {
        setProfileDetail(response?.data?.data?.user);
        setHeadshot(response?.data?.data?.user?.headshot);
        setVideoPopup(profileDetail?.isWatched);
        setEmail(profileDetail.email);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isLoggedIn, dataResync, videoPopup]);

  // const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const profileInfo = JSON.parse(localStorage.getItem("profile_info"));
    const role = profileInfo?.user?.role;
    setUserRole(role);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        videoPopup,
        minting,
        setMinting,
        setVideoPopup,
        headshot,
        setHeadshot,
        isLoggedIn,
        otpResetPassword,
        setResetToken,
        resetToken,
        setOtpResetPassword,
        headshot,
        profileDetail,
        role,
        setRole,
        handleLogin,
        navigate,
        setNavigate,
        handleLogout,
        email,
        setEmail,
        practitionerDetails,
        setPractitionerDetails,
        userRole,
        refetchFromLocalStorage,
        setRefetchFromLocalStorage,
        dataResync,
        setDataResync,
        setIsCreditCardModalOpen,
        setSuccessData,
        setOpenVerificationSuccess,
        setOpenVerificationFailure,
        setEditNftData,
        editNftData,
        liveStripe,
        stripe,
        editPractitionerNftData,
        setEditPractitionerNftData,
        isSideBarOpen,
        setIsSideBarOpen,
        otpResetPassword,
        setOtpResetPassword,
        showOtpPopup,
        setShowOtpPopup,
        password,
        setPassword,
        popupController,
        setPopupController,
        pendingNftData,
        setPendingNftData,
        minting,
        setMinting,
        userData,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuthContext };
