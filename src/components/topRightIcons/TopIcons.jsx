"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function TopIcons() {
  const { isSideBarOpen, setIsSideBarOpen, headshot, profileDetail } =
    useAuthContext();
  const [isPopupVisible, setPopupVisible] = useState();
  const popupRef = useRef(null);

  const handleSettingsClick = () => {
    if (isPopupVisible) {
      setPopupVisible(false);
    } else {
      setPopupVisible(true);
    }
  };

  const handleOutsideClick = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setPopupVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // handle side bar
  const handleClick = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };
  const router = useRouter();

  // logout;
  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("profile_info");
    localStorage.removeItem("access");
    router.push("/");
  }
  return (
    <>
      <div className=" my-16 ms-auto flex justify-end items-center relative">
        <div className="flex justify-between items-center w-full px-8 ">
          <button
            type="button"
            className={`w-[38px] h-[38px] cursor-pointer sm:w-[48px] sm:h-[48px]  border-0 bg-white/0 ${
              isSideBarOpen ? "hidden" : ""
            }`}
            onClick={handleClick}
          >
            {/* <Image
              src="/assets/pillar-nine-menu.png"
              alt="hamburger icon"
              className="w-[25px] h-[25px]"
              width='25'
              height='25'
            /> */}
            <span
              className="material-icons text-black"
              style={{ fontSize: "2.5rem" }}
            >
              menu
            </span>
          </button>
          <h1 className="hidden md:block  text-heading-xs sm:text-heading-sm lg:text-[2rem] font-bold leading-[18px] sm:leading-[44px] text-black">
            {profileDetail?.role === "Consumer"
              ? "Property Dashboard"
              : "Practitioner Dashboard"}{" "}
          </h1>
          <div className="flex justify-end items-center ms-auto">
            <div
              className="me-3 cursor-pointer"
              id="settings-button"
              onClick={handleSettingsClick}
            >
              <img
                className="ms-5 h-[27px] w-[27px]"
                src="/assets/icons/pillar-nine-sett.png"
                alt="pillar-nine-settingIcon"
              />
            </div>
            <Link href="/dashboard/edit-profile" className="rounded-full">
              <img
                className="rounded-full border-2 border-primary p-[1px]"
                src={
                  profileDetail?.headshot
                    ? profileDetail?.headshot
                    : "/assets/icons/pillar-nine-user.png"
                }
                alt=""
                height="42px"
                width="42px"
                style={{ width: "42px", height: "42px" }}
              />
            </Link>
          </div>
        </div>

        {isPopupVisible && (
          <div
            className=" bg-white  overflow-hidden absolute top-0 right-[4.7rem] sm:right-[5rem] md:right-[7rem] text-left rounded-lg cursor-pointer w-[210px]"
            id="popup"
            ref={popupRef}
            style={{ border: "1px solid black" }}
          >
            <Link
              href={"/dashboard/edit-profile"}
              className="flex  no-underline	 p-3 ps-4  hover:bg-primary/50"
            >
              <img src="/assets/icons/profile.svg" alt="" />
              <p className="ps-4 text-black">Profile</p>
            </Link>
            <Link
              href={"/dashboard/change-password"}
              className="flex no-underline	 p-3 ps-4 text-black hover:bg-primary/50"
            >
              <img src="/assets/icons/changePassword.svg" alt="" />
              <p className="ps-4">Change Password</p>
            </Link>
            <Link
              href={"/"}
              onClick={handleLogout}
              className="flex no-underline p-3 ps-4 text-black hover:bg-primary/50"
            >
              <img src="/assets/icons/logout.svg" alt="" />
              <p className="ps-4 ">Logout</p>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default TopIcons;
