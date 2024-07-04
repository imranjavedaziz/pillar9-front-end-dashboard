import React from "react";
import profile from "./profile.png";

const SinglePractitionerDetailPopup = ({
  practitionerData,
  setViewPractitionerDetail,
}) => {
  const handleCrossClick = () => {
    setViewPractitionerDetail(false);
  }

  const capitalizeName =(name)=> {

    const nameParts = name.split(" ");

    const capitalizeFirstLetter = nameParts.map((part)=> {
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    })

    const newName = capitalizeFirstLetter.join(' ');
    return newName;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className=" bg-white border-2 border-primary p-7 sm:p-10  rounded-[24px] drop-shadow-primaryDropShadow text-black"
      >
        
        <div className="py-[16px] md:px-[25px] md:py-[24px] rounded-3xl relative">
        <div className="absolute top-[-1.5rem] right-[-1.5rem] text-center" onClick={handleCrossClick}>
         
         <span
           className="material-icons cursor-pointer text-black"
           style={{ width: "2.5rem", height: "2.5rem", fontWeight: "bold" }}
         >
           close
         </span>
       
       </div>
          <h3 className="text-center mb-5 text-heading-xs sm:text-heading-sm lg:text-[2rem] font-semibold tracking-wide leading-[18px] sm:leading-[44px]">
            Practitioner Detail
          </h3>

         

          <div className=" grid grid-cols-1  md:grid-cols-3  gap-4">
            <div className="col-span-1 flex justify-center items-center">
              <img
                src={
                  (practitionerData && practitionerData?.headshot) || profile
                }
                alt="Profile"
                className="w-[70px] h-[70px] md:w-[140px] md:h-[140px] lg:w-[170px] lg:h-[170px] rounded-full"
              />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-3 mt-5">
              <h2 className="mb-2 text-[12px] md:text-[16px] lg:text-[24px] max-md:text-center">
                {practitionerData?.name && capitalizeName(practitionerData?.name)}
              </h2>
              <tr className=" text-[12px] md:text-[14px] lg:text-[18px] max-sm:px-5 max-md:px-7">
                <td>Email :</td>
                <td className="pl-4">
                  {practitionerData && practitionerData?.email}
                </td>
              </tr>
              <tr className=" text-[12px] md:text-[14px] lg:text-[18px] max-sm:px-5 max-md:px-7">
                <td>Company :</td>
                <td className="pl-4">
                  {practitionerData?.companyName && practitionerData?.companyName}
                </td>
              </tr>
              <tr className=" text-[12px] md:text-[14px] lg:text-[18px] max-sm:px-5 max-md:px-7">
                <td>Country :</td>
                <td className="pl-4">
                  {practitionerData?.country && capitalizeName(practitionerData?.country)}
                </td>
              </tr>
              <tr className=" text-[12px] md:text-[14px] lg:text-[18px] max-sm:px-5 max-md:px-7">
                <td>State :</td>
                <td className="pl-4">
                  {practitionerData?.state &&
                    capitalizeName(practitionerData.state)}
                </td>
              </tr>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePractitionerDetailPopup;
