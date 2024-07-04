"use client";

import AWS from "aws-sdk";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const CustomFileUpload = ({
  labelName,
  grayText,
  borderRadius,
  imageUrl,
  docUrl,
  setImageUrl,
  formId,
  maxFileSize,
  fileType,
  privateBucket = false,
  allowPdf = false,
  disabled,
}) => {
  const [fileUploader, setFileUploader] = useState(null);
  AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_SECRET,
    region: "us-east-1",
    signatureVersion: "v4",
  });

  const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", fileType];
  const MAX_FILE_SIZE = maxFileSize * 1024 * 1024; // 5MB

  const s3 = new AWS.S3();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file) {
      uploadToS3();
    }
  }, [file]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
        if (selectedFile.size <= MAX_FILE_SIZE) {
          setFile(selectedFile);
          setFileUploader((prevSelectedFile) => ({
            ...prevSelectedFile,
            [formId]: URL.createObjectURL(selectedFile),
          }));
        } else {
          toast.error("File size exceeds the maximum limit of 5MB.");
        }
      } else {
        toast.error(
          `Invalid file type. Only JPG, PNG ${
            fileType ? ", and PDF" : ""
          } files are accepted.`
        );
      }
    }
  };

  const uploadToS3 = async () => {
    setLoading(true);
    const params = {
      Bucket: (() => {
        return privateBucket
          ? process.env.NEXT_PUBLIC_UNLOCKABLE_BUCKET_NAME
          : process.env.NEXT_PUBLIC_BUCKET_NAME;
      })(),
      Key: `${Date.now() + file?.name?.replace(/[^./a-zA-Z0-9]/g, "")}`,
      Body: file,
    };
    try {
      const { Location } = await s3.upload(params).promise();
      setImageUrl(Location);
      setImageUrl(Location);
    } catch (error) {
      console.error("Error uploading to S3:", error);
    } finally {
      setLoading(false);
    }
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
        className={`p-0.5 border-black ${borderRadius} border-[2px] border-dashed rounded-[24px] ${
          disabled ? "" : "cursor-pointer"
        }`}
      >
        <label
          htmlFor={`fileInput-${formId}`}
          className={disabled ? "" : "cursor-pointer"}
        >
          <div
            className={`w-full h-[150px] bg-primary/50 {${borderRadius} flex justify-center items-center bg  px-2 overflow-hidden rounded-[24px] `}
          >
            {loading && fileUploader ? (
              <div>
                <div className="text-center text-sky-400/100">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-black"
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
            ) : imageUrl && !allowPdf ? (
              <img
                className="h-full"
                src={imageUrl}
                alt="Selected File Preview"
              />
            ) : allowPdf ? (
              <iframe className="h-full" src={imageUrl + "#toolbar=0"}></iframe>
            ) : (
              <>
                <span
                  className="material-icons text-black"
                  style={{ fontSize: "2rem" }}
                >
                  upload
                </span>
                <span className="text-[8px] sm:text-[12px] text-black/50 ml-2">
                  Click to upload photo
                </span>
              </>
            )}
          </div>

          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            id={`fileInput-${formId}`}
            disabled={disabled}
          />
        </label>
      </div>
    </div>
  );
};

export default CustomFileUpload;
