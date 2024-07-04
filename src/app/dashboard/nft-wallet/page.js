"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

import axios from "axios";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { BASE_URL } from "@/utilities/endpoints";
import { useAuthContext } from "@/context/authContext";
import { getToken } from "@/utilities/localStorage";
import { useLocalStorage } from "@/helpers/localStorage/useLocalStorage";

const NftWallet = () => {
  const [propertyData, setPropertyData] = useState(null);
  const [practitionerData, setPractitionerData] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [mintingValidaton, setMintingValidaton] = useState(false);
  const [hasMinted, sethasMinted] = useState(false);
  const [propNFTCheckerforPract, setPropNFTCheckerforPract] = useState(false);

  const { userRole, minting, setMinting, profileDetail } = useAuthContext();
  useEffect(() => {
    setTimeout(() => {
      setMinting(false);
    }, 4500);
  }, [minting]);

  const handleCopy = () => {
    const copiedTxt = document.getElementById("copyTxt").innerText;
    navigator.clipboard.writeText(copiedTxt);
    toast.success("Text Copied");
  };

  // fetch data
  async function fetchPropertyData() {
    try {
      const token = localStorage.getItem("access");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(`${BASE_URL}/api/user_property_list`, {
        headers,
      });
      if (response.data) {
        setPropertyData(response.data.results);
      } else {
        setMintingValidaton(true);
      }

      if (userRole === "Consumer") {
        setMintingValidaton(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  //practitioner data fetching;
  async function fetchPractitionerData() {
    try {
      const token = localStorage.getItem("access");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        `${BASE_URL}/api/user_practitioners_list`,
        {
          headers,
        }
      );

      if (response.data) {
        setPractitionerData(response.data.results);
        if (userRole === "Practitioner") {
          setMintingValidaton(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // Check if any object in propertyData has is_minted === true
    const mintingData =
      userRole === "Consumer" || propNFTCheckerforPract
        ? propertyData
        : practitionerData;
    const hasMintingChecker = mintingData?.some((obj) => obj.is_minted);

    if (hasMintingChecker) {
      sethasMinted(true); // Set the variable to true if there's a minted property
    }
    // eslint-disable-next-line
  }, [mintingValidaton]);

  useEffect(() => {
    document.title = "NFT Wallet";
    const profileInfo = JSON.parse(localStorage.getItem("profile_info"));
    setWalletAddress(profileInfo.user.walletId);
    fetchPropertyData();
    fetchPractitionerData();
  }, []);

  return (
    <>
      {minting ? (
        <>
          <div className="flex items-center justify-center h-[50vh]">
            <div className="flex text-black">
              <h1 className="text-2xl  md:text-4xl font-bold me-4">
                Minting...
              </h1>{" "}
              <LoadingSpinner w="34px" h="34px" />
            </div>
          </div>{" "}
        </>
      ) : (
        <>
          <div className="py-4 w-full px-2 sm:px-10">
            {/* heading */}
            <h1 className="text-heading-xs sm:text-heading-sm lg:text-heading-lg font-black leading-[18px] sm:leading-[44px] text-black">
              My Wallet
            </h1>
            <div className="bg-primary  px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full mx-auto sm:w-fit p-1 my-4">
              <p className="text-[8px] sm:text-label-sm font-semibold text-black">
                Wallet Address:
              </p>
              <p id="copyTxt" className="text-[8px] sm:text-label-sm">
                {walletAddress?.replace(/-/g, "")}
              </p>
              <img
                src="/assets/icons/copyIcon.svg"
                alt="Copy Icon"
                className="w-[12px] h-[12px]  sm:w-[16px] sm:h-[16px] cursor-pointer"
                onClick={handleCopy}
              />
            </div>
            {/* body */}
            <div className="bg-black p-[1px] rounded-[24px] mt-10 mb-[7.5rem]">
              <div
                style={{
                  backgroundColor: "white",
                }}
                className="w-full py-10 px-5 sm:p-10 rounded-[24px]"
              >
                <div className="flex justify-between">
                  <h2 className="text-heading-xs font-bold sm:text-heading-sm md:text-heading-lg text-black">
                    Property NFTs
                  </h2>
                  <div className="flex items-center gap-2.5 cursor-pointer h-fit my-auto">
                    <span
                      class="material-icons text-black"
                      style={{ width: "1.5rem" }}
                    >
                      table_view
                    </span>
                    <span className="text-label-xs sm:text-label-md text-black">
                      View All
                    </span>
                  </div>
                </div>
                {/* cards */}
                <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6 sm:mt-10 text-black">
                  {propertyData &&
                    propertyData?.map((item, ind) => (
                      <>
                        <div
                          key={ind}
                          className="p-2 rounded-[15px] bg-light-blue min-h-[400px] bg-primary"
                        >
                          <div className=" h-[70%] relative ">
                            <Link
                              href={`/dashboard/propertyNftDetail/${item.id}`}
                            >
                              <img
                                src={item.image}
                                alt="NFTImage"
                                className="w-full object-cover bg-cover block h-full rounded-lg cursor-pointer"
                              />
                            </Link>
                            {item.is_minted === false && (
                              <p className="absolute bottom-1 left-1 bg-[#d9512c] px-3 py-1 text-white rounded text-[9px] lg:text-[14px]">
                                Pending
                              </p>
                            )}
                          </div>
                          <div className="p-4 pb-6 h-30% ">
                            <h3 className="text-[10px] sm:text-[13px] lg:text-[18px] font-medium">
                              {item.title.replace("@", "").slice(0, 12)}
                            </h3>
                            <p className="text-[8px] lg:text-[14px] w-[75%] text-grayish font-medium">
                              {item.address.length >= 40
                                ? item.address.slice(0, 40) + "..."
                                : item.address}
                            </p>
                          </div>
                        </div>
                      </>
                    ))}
                </div>

                {profileDetail?.role === "Practitioner" && (
                  <>
                    <div className="flex justify-between mt-24">
                      <h2 className="text-heading-xs sm:text-heading-sm font-bold md:text-heading-lg text-black">
                        Practitioner NFTs
                      </h2>
                      <div className="flex items-center gap-2.5 cursor-pointer h-fit my-auto">
                        <span
                          class="material-icons text-black"
                          style={{ width: "1.5rem" }}
                        >
                          table_view
                        </span>
                        <span className="text-label-xs sm:text-label-md text-black">
                          View All
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-12 sm:mt-10">
                      {practitionerData &&
                        practitionerData.map((item, ind) => (
                          <>
                            <div
                              key={ind}
                              className="p-2 bg-primary rounded-[15px] bg-light-blue h-[340px] text-black"
                            >
                              <div className=" h-[70%] relative ">
                                <Link
                                  href={`/dashboard/practitionerNftDetail/${item.id}`}
                                >
                                  <img
                                    src={item.image}
                                    alt="Practitioner NFT"
                                    className="w-full object-cover bg-cover block h-full rounded-lg cursor-pointer"
                                  />
                                </Link>
                                {!item.is_minted && (
                                  <p className="absolute bottom-1 left-1 bg-[#d9512c] px-3 py-1 rounded text-[9px] lg:text-[14px]">
                                    Pending
                                  </p>
                                )}
                              </div>
                              <div className="p-4 pb-6">
                                <h3 className="text-[10px] sm:text-[13px] lg:text-[18px] font-medium">
                                  {item.name}
                                </h3>
                                <p className="text-[8px] lg:text-[14px] w-[75%] text-grayish font-medium">
                                  {item.address.length >= 40
                                    ? item.address.slice(0, 40) + "..."
                                    : item.address}
                                </p>
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NftWallet;
