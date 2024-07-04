"use client";

import React, { useState, useEffect } from "react";

import propertyImg from "public/homee.jpeg";
import BlockchainDataPopup from "@/components/popups/blockchainData/BlockchainDataPopup";
import profileImg from "public/lisa.jpg";
import downloadIcon from "public/assets/icons/pillar-nine-download.png";
import axios from "axios";
import {
  BASE_URL,
  GET_PROFILE_BY_USERID,
  MINT_PROPERTY_NFT,
  PROPERTY_NFT_BLOCKCHAIN_DATA,
} from "@/utilities/endpoints";
import api from "@/utilities/api";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authContext";
import CustomDetailButton from "@/components/formElements/CustomDetailButton";
import apinew from "@/utilities/apinew";
import { getToken } from "@/utilities/localStorage";
import Link from "next/link";
import Layout from "../../layout";
const Page = ({ params }) => {
  const router = useRouter();
  const { headshot, profileDetail, setPendingNftData } = useAuthContext();
  const [agentDetails, setAgentDetails] = useState({});
  const [dataPopup, setDataPopup] = useState(false);
  const [blockchainData, setBlockchainData] = useState(null);
  const [nftDetail, setNftDetail] = useState({});
  const [propertyData, setPropertyData] = useState({
    image: "",
    title: "",
    name: "",
    bio: "",
    wallet_address: "",
    tx_id: null,
    is_minted: null,
    docCategory: null,
    updated_at: null,
    admin_failed_reason: "",
  });

  // time stamp formatting;
  const formatTimeStamp = (timestamp) => {
    // date object
    const dateObj = new Date(timestamp);

    // Define the options for formatting the date and time
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    // Format the date and time according to the specified options
    return dateObj.toLocaleString("en-US", options);
  };

  const id = params.id;
  async function fetchPropertyData() {
    try {
      const token = localStorage.getItem("access");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(`${BASE_URL}/api/property_nft/${id}`, {
        headers,
      });
      setPropertyData(response?.data?.data);
      setNftDetail(response?.data?.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchPropertyData();
    document.title= 'Propery NFT Detail'
  }, []);

  const { nftData, setNftData } = useAuthContext();
  const editNftDataHandler = () => {
    router.push("/dashboard/mint-property-nft");
    setPendingNftData(nftDetail);
  };

  const [blockchainContent, setBlockchainContent] = useState("");
  const [windowSize, setWindowSize] = useState(null);

  const handleResize = () => {
    setWindowSize(window.innerWidth);
    if (windowSize < 650) {
      setBlockchainContent("Download File");
    } else {
      setBlockchainContent("Download Verified File");
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowSize]);

  // const failedReason = propertyData.admin_failed_reason
  //   ? propertyData.admin_failed_reason.split("\n")
  //   : null;

  useEffect(() => {
    const getAgentDetail = async () => {
      try {
        apinew.setJWT(getToken());
        const res = await apinew.get(
          GET_PROFILE_BY_USERID + propertyData?.practitioner_id
        );

        setAgentDetails(res.data?.data?.user);
      } catch (error) {
        console.log(error);
      }
    };

    if (propertyData?.practitioner_id) {
      getAgentDetail();
    }
  }, [propertyData]);

  // useEffect(() => {
  //   if (propertyData?.practitioner_id) {
  //     getUserData();
  //   }
  // }, [propertyData?.practitioner_id]);

  function capitalizeName(name) {
    if (name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    } else {
      return "";
    }
  }

  const [isDownloading, setIsDownloading] = useState(false);

  const donwloadAsPdf = async (signedUrl) => {
    setIsDownloading(true);
    const response = await fetch(signedUrl);
    const blob = await response.blob();
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "Document.pdf";
    a.click();
    setIsDownloading(false);
  };

  // copy wallet ID
  const handleCopy = (walletId) => {
    navigator.clipboard.writeText(walletId);

    toast.success("Wallet ID Copied");
  };

  // const is_minted = false;
  // const document = '';
  // const practitioner_id = false;
  // const failed_reason = true;

  return (
    <>
      <div className="py-4 w-full px-2 sm:px-10">
        <h1 className="text-heading-xs text-black font-bold sm:text-heading-sm lg:text-heading-lg font-graphik leading-[18px] sm:leading-[44px] ">
          Property NFT Details
        </h1>
        <div className="bg-[#e6d366] p-[1px] rounded-[24px] mt-10 mb-[7.5rem]">
          <div className="bg-white w-full h-full py-10 px-5 sm:p-10 rounded-[24px]">
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 text-black">
              <div className="h-[199px] sm:h-[328px]">
                <img
                  src={propertyData && propertyData?.image}
                  alt="house"
                  className="w-full h-full max-h-[400px]  rounded-[24px] bg-primary object-contain"
                />
              </div>
              <div className="text-black">
                <div className="flex justify-between">
                  <h2 className="text-[13px] text-black font-bold md:text-[18px] lg:text-[24px]">
                    {propertyData && propertyData?.title.replace("@", "")}
                  </h2>
                </div>
                <span className="text-[13px] md:text-[20px] text-black font-semibold">
                  Minter
                </span>

                <div className="flex items-center gap-3 mt-3">
                  <button className="rounded-full border-[2px] border-[#e6d366] border-solid w-[48px] h-[48px] overflow-hidden cursor-pointer">
                    <img
                      className="rounded-full w-full h-full"
                      src={headshot ? headshot : profileImg}
                      alt="Profile"
                    />
                  </button>
                  {/* <span className="text-[9px] sm:text-[14px] font-medium text-black">
                  {profileDetail &&
                      `${profileDetail.firstName} ${profileDetail.lastName}`}
                  </span> */}
                </div>

                {propertyData?.is_minted === false ? (
                  <CustomDetailButton
                    onClick={() => editNftDataHandler()}
                    text="Edit Detail"
                    mt="mt-8"
                  />
                ) : propertyData?.document === "" ? (
                  ""
                ) : (
                  <button
                    onClick={() =>
                      donwloadAsPdf(propertyData?.document_preview)
                    }
                    type="button"
                    className={`flex justify-center items-center gap-2 px-8 py-2 mt-8 bg-primary text-black border-none cursor-pointer text-sm rounded-[2rem] hover:bg-[#ffe3a1]  font-semibold`}
                  >
                    {blockchainContent}{" "}
                    {isDownloading ? <LoadingSpinner /> : null}
                  </button>
                )}

                <div className="mt-6">
                  <h4 className="text-[14px] md:text-[22px] font-semibold text-black">
                    Poperty address:
                  </h4>
                  <p className="text-black mt-2">{propertyData.address}</p>
                </div>
                {propertyData?.document === "" ? (
                  ""
                ) : (
                  <div className="mt-3 sm:mt-6 flex flex-col justify-center gap-1.5 sm:gap-3">
                    <p className="text-sm sm:text-[1.25rem] text font-medium">
                      Document Type:
                    </p>
                    <p className="text-xs sm:text-[0.9rem] font-normal text-grayish">
                      {propertyData.docCategory === "settlement"
                        ? "Settlement Statement"
                        : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* nft detail bottom */}

            <div className="py-10 mt-5">
              <div className="flex justify-between items-center">
                <h3 className="text-[16px] lg:text-[24px] font-medium text-black">
                  NFT History for Token ID: {propertyData.block_id}
                </h3>
              </div>
              <div className="pt-5 md:pt-5 ">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="[&>*]:text-start text-black [&>*]:font-medium sm:[&>*]:font-semibold [&>*]:p-4  [&>*]:text-[9px] lg:[&>*]:text-[14px] [&>*]:border-0 [&>*]:border-b-[1px] [&>*]:border-solid [&>*]:border-b-[#e6d366]">
                      <th>Token ID</th>
                      <th> Action</th>
                      <th>wallet ID</th>
                      <th>Timestamp</th>
                      {!propertyData.is_minted && <th>Reason</th>}
                      {propertyData?.practitioner_id && <th> Agent</th>}
                    </tr>
                  </thead>
                  <tbody className="text-black ">
                    <tr className="hover:bg-[#ffffff14] [&>*]:text-start [&>*]:font-medium sm:[&>*]:font-normal [&>*]:p-4  [&>*]:text-[9px] lg:[&>*]:text-[14px] [&>*]:border-0 [&>*]:border-b-[1px] [&>*]:border-solid [&>*]:border-b-[#e6d366]">
                      <td>
                        {propertyData.block_id
                          ? `${propertyData.block_id}`
                          : "_ _"}
                      </td>
                      <td>
                        {propertyData.nft_gifted_user
                          ? "Gifted"
                          : propertyData.is_minted
                          ? "Mint"
                          : "Pending"}
                      </td>
                      <td>
                        <div className="gap-[5px] flex items-center flex-nowrap">
                          <div className="inline">
                            {propertyData.minter
                              ? `${propertyData.minter?.slice(0, 12)}...`
                              : "_ _"}
                          </div>

                          <span
                            onClick={() => handleCopy(propertyData.minter)}
                            className="material-icons cursor-pointer ms-2 text-black"
                            style={{ fontSize: "1.5rem", color: "black" }}
                          >
                            content_copy
                          </span>
                        </div>
                      </td>

                      <td>
                        {formatTimeStamp(propertyData.updated_at).replace(
                          "at",
                          ""
                        )}
                      </td>

                      {!propertyData.is_minted && (
                        <td>{propertyData?.property_nft_status}</td>
                      )}

                      {propertyData?.practitioner_id && (
                        <td className="font-semibold flex justify-start items-center gap-4">
                          <img
                            src={agentDetails?.headshot}
                            alt="agent profile"
                            className="w-10 aspect-square rounded-full border-2 border-solid border-primary-main"
                          />
                          <Link
                            target="_blank"
                            href={`/dashboard/practitionerNftDetail/${propertyData?.practitioner_nft_id}`}
                            className="cursor-pointer  text-black font-semibold underline"
                          >
                            {agentDetails?.firstName +
                              " " +
                              agentDetails?.lastName}
                          </Link>
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
