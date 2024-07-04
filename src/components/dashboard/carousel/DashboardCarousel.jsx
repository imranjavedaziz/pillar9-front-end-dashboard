// 'use client'

// import React from "react";
// import arrowRight from "../../../../../public/assets/arrowRight.svg";
// import CarouselItem from "./CarouselItem";
// import item1 from "../../../../../public/assets/carouselItem1.png";
// import item2 from "../../../../../public/assets/carouselItem2.svg";
// import consumerImg1 from "../../../../../public/assets/Home Owner Journey (2).svg";
// import { useRef } from "react";
// import Image from "next/image";
// // import { useAuthContext } from "@/app/context/authContext";

// const DashboardCarousel = () => {
//   const item = useRef();

//   // const { userRole } = useAuthContext();
//   // console.log("userRoleuserRole",userRole);
//   // const userRole = "Practitioner";
//   const userRole = "Practitioner";

//   // prev btn click

//   const prevBtnClick = () => {
//     const width = item.current.clientWidth;
//     item.current.scrollLeft = item.current.scrollLeft - width;
//   };

//   // next btn click

//   const nextBtnClick = () => {
//     const width = item.current.clientWidth;
//     item.current.scrollLeft = item.current.scrollLeft + width;
//   };

//   // carousel content
//   const carouselContent =
//     userRole === "Consumer"
//       ? [
//         {
//           id: 1,
//           img: consumerImg1,
//           // img: "./assets/Home Owner Journey (2).svg",
//         },
//       ]
//       :
//       [
//         {
//           id: 1,
//           img: item1,
//         },
//         {
//           id: 2,
//           img: item2,
//         },
//       ]

//   return (
//     <div className="min-h-[200px] h-[60%] sm:h-[80%] flex  items-center  relative px-5 bg-[#0D0927] rounded-[50px] sm:rounded-[58px]">
//       <button
//         onClick={prevBtnClick}
//         className={`cursor-pointer w-[50px] absolute z-[1] border-none -left-4 p-1 sm:p-2 aspect-square bg-[#e6d366] rounded-full flex justify-center items-center max-sm:w-[35px] ${
//           carouselContent.length > 1 ? "flex" : "hidden"
//         }`}
//       >
//         <Image
//           className="w-fit bg-[#e6d366]  max-sm:w-[20px] aspect-square"
//           src={arrowRight}
//           alt="pillar-nine arrowRight image"
//         />
//       </button>

//       <div
//         ref={item}
//         className="overflow-hidden flex items-center scroll-smooth rounded-[30px]"
//       >
//         {carouselContent?.map((item, ind) => {
//           return <CarouselItem img={item.img} key={item.id} />;
//         })}
//       </div>

//       <button
//         onClick={nextBtnClick}
//         className={`cursor-pointer w-[50px] absolute z-[1] border-none -right-4 p-1 sm:p-2 aspect-square bg-[#e6d366] rounded-full flex justify-center items-center max-sm:w-[35px]  ${
//           carouselContent.length > 1 ? "flex" : "hidden"
//         }`}
//       >
//         <Image
//           className="w-fit bg-[#e6d366] max-sm:w-[20px] aspect-square rotate-180"
//           src={arrowRight}
//           alt=""
//         />
//       </button>
//     </div>
//   );
// };

// export default DashboardCarousel;
