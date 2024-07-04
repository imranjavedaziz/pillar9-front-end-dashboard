'use client'
import React, {useState, useEffect} from 'react'
import { useAuthContext } from "@/app/context/authContext";

const WellcomeVideoPopup = () => {
  
//   const [isShowVideo, setIsShowVideo] = useState(true)
const {setIsShowVideo, userRole} = useAuthContext()


  const handleCrossClick = async () => {
    setIsShowVideo(false)
  };
 


  const consumerVideo =
  "https://www.youtube.com/embed/KwALbwJXbqQ";
  const practitionerVideo = "https://consortiamedia.s3.amazonaws.com/Getting+Started+-+WITH+CAPTIONS.mp4";
  return (
    <>
      <div
        className="py-4 px-8 fixed inset-0 flex items-center  justify-center z-50 bg-black/90 "
      >
         <img
            onClick={handleCrossClick}
            src="/x-button.png"
            alt=""
            className="w-[25px] h-[25px] sm:w-[24px] sm:h-[24px] right-[13rem] absolute sm:right-[13rem] top-[7rem] sm:top-[7rem] cursor-pointer"
            style={{right: '15rem', top: '7rem'}}
          />

        <div
         
          className=" no-scrollbar w-[60%] h-[65%] overflow-none mx-auto relative mt-5  p-[1px] rounded-[24px]"
        >
         

          <div className=" h-full w-full">
            <iframe
            //   className="h-[400px] min-[1600px]:h-[500px] min-[2000px]:h-[600px]"
              width="100%"
              className="h-[auto] w-full rounded-[24px]"
              style={{ height: `400px` }}
              src={userRole === "Consumer" ? consumerVideo : practitionerVideo}
              title="YouTube video player"
            //   frameBorder="0"
              height='auto'
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default WellcomeVideoPopup;
