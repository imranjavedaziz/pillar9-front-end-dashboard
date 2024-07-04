"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/context/authContext";

function Sidebar() {
  const {
    isSideBarOpen,
    setIsSideBarOpen,
    userRole,
    profileDetail,
    dataResync,
    setDataResync,
    role,
  } = useAuthContext(null);
  const pathname = usePathname();

  // useEffect(()=> {
  //   setDataResync((prev)=> !prev)
  // }, [userRole])

  const [windowSize, setWindowSize] = useState(null);
  const [practitionerNftsIcon, setPractitionerNftsIcon] = useState(false);
  const controlpractitionerNftsIcon = () => {
    if (practitionerNftsIcon) {
      setPractitionerNftsIcon(false);
    } else {
      setPractitionerNftsIcon(true);
    }
  };
  const [propertNftsIcon, setPropertyNftsIcon] = useState(false);
  const controlPropertyNftsIcon = () => {
    if (propertNftsIcon) {
      setPropertyNftsIcon(false);
    } else {
      setPropertyNftsIcon(true);
    }
  };

  // handle sidebar on mobile in different devices

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
      if (windowSize < 900) {
        setIsSideBarOpen(false);
      } else {
        setIsSideBarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowSize]);

  const [activeColor, setActiveColor] = useState(false);
  const handleClick = () => {
    setIsSideBarOpen(!isSideBarOpen);
    setActiveColor((prev) => !prev);
  };

  // handle outside click
  const sidebarRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSideBarOpen(false);
    }
  };

  useEffect(() => {
    if (windowSize < 900) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [windowSize]);

  // styles for active and normal links belowz
  const normalLink =
    "flex px-4 py-2 items-center text-white no-underline  gap-2.5 h-14 border-l-[4px] border-0 border-solid border-white/0";

  const subCategoryNormalLink =
    "flex items-center py-2 ms-4 py-3 ps-4 text-white no-underline border-l-[4px] border-0 border-solid border-white/0";

  return (
    <>
      {isSideBarOpen && (
        <div
          ref={sidebarRef}
          className={`h-screen overflow-auto border-r-2 border-solid  min-w-[200px] sm:min-w-[310px] md:min-w-[290px] bg-white py-6  md:block`}
          style={
            isSideBarOpen && windowSize < 900
              ? {
                  position: "absolute",
                  zIndex: "999",
                  minHeight: "100vh",
                }
              : {}
          }
        >
          <Link href={"/dashboard"} className="flex justify-center mt-8">
            <img
              src="/pillar-9-logo (1).png"
              alt="Consortia logo"
              className="w-[171px] h-[62px]"
            />
          </Link>
          <nav className="mt-[4rem]">
            <Link
              onClick={isSideBarOpen && windowSize < 900 ? handleClick : null}
              href="/dashboard"
              className={`${normalLink} ${
                pathname === "/dashboard" && "bg-[#e6d366]"
              }`}
              style={{ display: "flex", padding: "1rem" }}
            >
              <img
                src="/assets/icons/new-dashboard.png"
                alt=""
                className="w-[22px] h-[22px]"
              />
              <span className="text-[12px] text-black md:text-[14px] font-semibold ">
                Dashboard
              </span>
            </Link>

            <div className=" hover:text-white">
              <div
                className="flex px-4 py-5 items-center no-underline gap-3 cursor-pointer"
                onClick={controlPropertyNftsIcon}
              >
                <img
                  src="/assets/icons/new-house.png"
                  alt=""
                  className="w-[22px] h-[22px]"
                />
                <span className="text-[12px] md:text-[14px] text-black font-semibold">
                  Property
                </span>

                <span className="material-symbols-outlined ms-auto text-[gray]">
                  {!propertNftsIcon ? (
                    <img
                      src="/assets/icons/pillar-nine-right-arrow.png"
                      alt=""
                      className="w-[15px] h-[15px]"
                    />
                  ) : (
                    <img
                      src="/assets/icons/pillar-nine-down-arrow.png"
                      alt=""
                      className="w-[15px] h-[15px]"
                    />
                  )}
                </span>
              </div>
              {propertNftsIcon && (
                <Link
                  onClick={
                    isSideBarOpen && windowSize < 900 ? handleClick : null
                  }
                  href="/dashboard/mint-property-nft"
                  className={`${subCategoryNormalLink} ${
                    pathname === "/dashboard/mint-property-nft" &&
                    "bg-[#e6d366]"
                  }`}
                >
                  <img
                    src="/assets/icons/new-nft.png"
                    alt=""
                    className="w-[22px] h-[22px]"
                  />
                  <span className="text-[12px] md:text-[14px] ms-2 text-black font-semibold">
                    Mint NFT
                  </span>
                </Link>
              )}
            </div>
            {profileDetail?.role === "Practitioner" && (
              <div>
                <div
                  className="flex px-4 py-5 text-white items-center no-underline gap-3 cursor-pointer"
                  onClick={controlpractitionerNftsIcon}
                >
                  <img
                    src="/assets/icons/new-house.png"
                    alt=""
                    className="w-[22px] h-[22px]"
                  />
                  <span className="text-[12px] md:text-[14px] text-black font-semibold">
                    Practitioner NFT
                  </span>

                  <span className="material-symbols-outlined ms-auto text-[gray]">
                    {practitionerNftsIcon ? (
                      <img
                        src="/assets/icons/pillar-nine-down-arrow.png"
                        alt=""
                        className="w-[15px] h-[15px]"
                      />
                    ) : (
                      <img
                        src="/assets/icons/pillar-nine-right-arrow.png"
                        alt=""
                        className="w-[15px] h-[15px]"
                      />
                    )}
                  </span>
                </div>

                {practitionerNftsIcon && (
                  <Link
                    onClick={
                      isSideBarOpen && windowSize < 900 ? handleClick : null
                    }
                    href="/dashboard/mint-practitioner-nft"
                    className={`${subCategoryNormalLink} ${
                      pathname === "/dashboard/mint-practitioner-nft" &&
                      "bg-[#e6d366]"
                    } `}
                  >
                    <img
                      src="/assets/icons/new-nft.png"
                      alt=""
                      className="w-[22px] h-[22px] mr-[.6rem]"
                    />
                    <span className="text-[12px] md:text-[14px] font-semibold ms-2 text-black">
                      Mint NFT
                    </span>
                  </Link>
                )}
                {/* <Link
                  onClick={
                    isSideBarOpen && windowSize < 900 ? handleClick : null
                  }
                  href="/dashboard/nft-wallet"
                  className={`${normalLink} ${
                    pathname === "/dashboard/nft-wallet" && "bg-[#e6d366]"
                  } `}
                >
                  <img
                    src="/assets/icons/new-wallet.png"
                    alt=""
                    className="w-[22px] h-[22px] mr-[.6rem]"
                  />
                  <span className="text-[12px] md:text-[14px] text-black  font-semibold">
                    NFT Wallet
                  </span>
                </Link> */}
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

export default Sidebar;
