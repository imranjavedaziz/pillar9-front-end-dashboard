import React from "react";

const BlockchainDataPopup = ({ setDataPopup, data }) => {
  const handleCrossClick = () => {
    setDataPopup(false);
  };
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 ">
        <div className="bg-white p-7 sm:p-10 relative  w-[80%] sm:w-[380px] md:w-[571px] rounded-[24px] text-black ">
          <div className="flex justify-between items-center">
            <h2 className="text-heading-xs sm:text-heading-sm mb-4 md:text-heading-lg font-semibold ">
              Blockchain Data
            </h2>
            <div onClick={handleCrossClick}>
              <span
                className="material-icons cursor-pointer absolute right-4 sm:right-4 top-[1rem] sm:top-[1rem]"
                style={{ fontSize: "2rem" }}
              >
                close
              </span>
            </div>
          </div>

          <div className="overflow-auto py-3 mb-4">
            <code className="">{JSON.stringify(data)}</code>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockchainDataPopup;
