"use client";

import { useAuthContext } from "@/context/authContext";
import apinew from "@/utilities/apinew";
import { EDIT_USER_PROFILE } from "@/utilities/endpoints";
import { getId, getToken } from "@/utilities/localStorage";

const WellcomeVideoPopup = () => {
  const { setDataResync, setVideoPopup } = useAuthContext();
  const handleCrossClick = async () => {
    setDataResync(false);
    const payload = {
      isWatched: true,
    };

    try {
      setDataResync(false);
      apinew.setJWT(getToken());
      await apinew.patch(EDIT_USER_PROFILE + "/" + getId(), payload);
      setDataResync((prev) => !prev);
      setVideoPopup(true);
    } catch (error) {
      console.log(error);
    }
  };

  const practitionerVideo =
    "https://consortiamedia.s3.amazonaws.com/Getting+Started+-+WITH+CAPTIONS.mp4";
  return (
    <>
      <div className="py-4 px-8 fixed inset-0 flex items-center  justify-center z-50 bg-black/50 ">
        <div className=" no-scrollbar w-[90%] sm:w-[60%] h-[65%] overflow-none mx-auto relative mt-5  p-[1px] rounded-[24px]">
          <span
            onClick={handleCrossClick}
            className="material-icons absolute right-[1rem] sm:right-[1rem] top-[1rem] sm:top-[1rem] font-bold cursor-pointer"
            style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}
          >
            close
          </span>

          <div className=" h-full w-full">
            <iframe
              // className="h-[400px] min-[1600px]:h-[500px] min-[2000px]:h-[600px] rounded-lg"
              width="100%"
              className="h-[auto] w-full rounded-[24px]"
              style={{ height: `400px` }}
              src={practitionerVideo}
              title="YouTube video player"
              height="auto"
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
