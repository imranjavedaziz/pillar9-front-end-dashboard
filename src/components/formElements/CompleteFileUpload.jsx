"use client";

import React, { useEffect, useRef } from "react";
import AWS from "aws-sdk";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocalStorage } from "@/helpers/localStorage/useLocalStorage";

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_ACCESS_KEY_SECRET,
});

const CompleteFileUpload = ({
  labelName,
  grayText,
  formId,
  s3Url,
  setS3Url,
  borderRadius,
  width,
  allowPdf = false,
  privateBucket = false,
  practitioner,
  uploadingToS3,
  setUploadingToS3,
  maxUploadSizeMB,
  editFilePayload,
  property,
  maxFileSize,
}) => {
  const [file, setFile] = useState("");
  const [fileType, setFileType] = useState("");

  const [iframeStyle, setIframeStyle] = useState({
    zIndex: 50,
    height: "100%",
  });

  const [showExitLargeScreenIcon, setShowExitLargeScreenIcon] = useState(false);

  const ref = useRef();
  const [profile_info] = useLocalStorage("profile_info", null);

  const myBucket = new AWS.S3({
    params: {
      Bucket: privateBucket
        ? process.env.NEXT_PUBLIC_UNLOCKABLE_BUCKET_NAME
        : process.env.NEXT_PUBLIC_BUCKET_NAME,
    },
    region: process.env.NEXT_PUBLIC_REGION,
  });

  const isValidFileType = (fileType) =>
    allowPdf
      ? ["image/jpeg", "image/png", "application/pdf"].includes(fileType)
      : ["image/jpeg", "image/png"].includes(fileType);
  const isValidFileSize = (fileSize) =>
    fileSize <
    (maxUploadSizeMB ? maxUploadSizeMB * 1048576 : 1048576 * maxFileSize);
  useEffect(() => {
    const profileInfo = JSON.parse(localStorage.getItem("profile_info"));
    if (practitioner && profileInfo?.user?.role === "Practitioner") {
      setFile(profileInfo?.user?.headshot);
    }
    if (property && editFilePayload) {
      if (editFilePayload?.includes("pdf")) setFileType("application/pdf");
      setFile(editFilePayload);
    }
  }, []);

  const handleChange = (e) => {
    if (!isValidFileType(e.target.files[0]?.type)) {
      e.target.value = null;
      allowPdf
        ? toast.error("Only PDF, JPG and PNG files are allowed")
        : toast.error("Only JPG and PNG  files are allowed");
      return;
    }

    if (!isValidFileSize(e.target.files[0].size)) {
      e.target.value = null;
      allowPdf
        ? toast.error(
            `Image/File size should be less than ${
              maxUploadSizeMB ? maxUploadSizeMB : 1
            } MB`
          )
        : toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingToS3(true);
    setFileType(e.target.files[0].type);
    setFile(URL.createObjectURL(e.target.files[0]));
    myBucket.upload(
      {
        Bucket: privateBucket
          ? process.env.NEXT_PUBLIC_UNLOCKABLE_BUCKET_NAME
          : process.env.NEXT_PUBLIC_BUCKET_NAME,
        Key: Date.now() + e.target.files[0].name.replace(/[^./a-zA-Z0-9]/g, ""),
        ContentType: e.target.files[0].type,
        Body: e.target.files[0],
      },
      async (err, data) => {
        if (err) {
          setUploadingToS3(false);
          console.log("err", err);
        } else {
          setS3Url(data?.Location);
          setUploadingToS3(false);
        }
      }
    );
    e.target.value = null;
  };

  const handleClick = (e) => {
    ref.current.click();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleChange({
      target: {
        files: files,
      },
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy"; // Show "copy" cursor
  };

  return (
    <div className="space-y-1.5">
      <h4 className="text-label-xs sm:text-label-sm xl:text-label-lg leading-4 sm:leading-[1.4375em] text-black font-normal">
        {labelName}
      </h4>
      <span className="block text-black/50 text-[9px] sm:text-[12px]">
        {grayText}
      </span>
      <div
        className={`p-0.5 border-black ${borderRadius} border-[2px] border-dashed rounded-[24px] cursor-pointer`}
      >
        <label htmlFor={`fileInput-${formId}`} className="cursor-pointer">
          <div
            className={`w-full h-[150px] bg-primary/50 {${borderRadius} flex justify-center items-center bg  px-2 overflow-hidden rounded-[24px] `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick}
          >
            {file == "" ? (
              <>
                <span
                  className="material-icons text-black"
                  style={{ fontSize: "2rem" }}
                >
                  upload
                </span>
                <span className="text-[8px] sm:text-[12px] text-black opacity-50 ml-2">
                  Click to upload Document
                </span>
              </>
            ) : uploadingToS3 ? (
              <div>
                <div className="text-center text-primary">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-8 h-8 mr-2 text-gray-400 animate-spin dark:text-gray-600 fill-black"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              </div>
            ) : fileType == "application/pdf" ? (
              <div
                style={{
                  position: "relative",
                  height: "inherit",
                }}
              >
                <span
                  className="material-icons cursor-pointer absolute max-[440px]:right-[50px] right-[23px] text-black top-[14px]"
                  onClick={(e) => {
                    if (e && e.stopPropagation) e.stopPropagation();
                    setFile("");
                    setS3Url("");
                    setFileType("");
                    e.target.value = null;
                  }}
                  style={{ fontSize: "1rem" }}
                >
                  close
                </span>
                <img
                  alt=""
                  title="Toggle Big Screen"
                  src="/assets/icons/colorEye.svg"
                  className="absolute inset-0 m-auto h-[30px] w-[30px] cursor-pointer "
                  onClick={(e) => {
                    if (e && e.stopPropagation) e.stopPropagation();
                    setIframeStyle((prev) => ({
                      ...prev,
                      position: "fixed",
                      top: "5vh",
                      left: "5vw",
                      height: "90vh",
                      width: "90vw",
                    }));
                    setShowExitLargeScreenIcon(true);
                  }}
                />

                {showExitLargeScreenIcon && (
                  <span
                    className="material-icons fixed right-16 top-12 sm:right-20 md:right-28 lg:right-36 lg:top-14 text-red-900 bg-primary rounded-full"
                    onClick={(e) => {
                      if (e && e.stopPropagation) e.stopPropagation();
                      setShowExitLargeScreenIcon(false);
                      setIframeStyle({
                        zIndex: 50,
                        // width: belowSm ? "100%" : "auto",
                        height: "100%",
                      });
                    }}
                    style={{ zIndex: 900000, fontSize: "2rem" }}
                  >
                    close
                  </span>
                  // <Image
                  //     alt=""
                  //     title="Toggle Small View"
                  //     fontSize="large"
                  //     src="/assets/icons/colorCross.svg"
                  //     width="30"
                  //     height="30"
                  //     style={{

                  //         zIndex: 900000,

                  //     }}
                  //     className="fixed right-16 top-12 sm:right-20 md:right-28 lg:right-36 lg:top-16"
                  //     onClick={(e) => {
                  //         if (e && e.stopPropagation) e.stopPropagation();
                  //         setShowExitLargeScreenIcon(false);
                  //         setIframeStyle({
                  //             zIndex: 50,
                  //             // width: belowSm ? "100%" : "auto",
                  //             height: "100%",
                  //         });
                  //     }}
                  // />
                )}

                <iframe style={iframeStyle} src={file + "#toolbar=0"}></iframe>
              </div>
            ) : (
              <img className="h-full" src={file} alt="Selected File Preview" />
            )}
          </div>

          <input
            type="file"
            ref={ref}
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  );
};

export default CompleteFileUpload;
