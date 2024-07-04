"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import floorPlan from "../../../../../public/assets/Floor Plan.svg";
import inviteClients from "../../../../../public/assets/Invite your clients 1.svg";
import certifiedListing from "../../../../../public/assets/Make Certified Listing 1.svg";
import mintPractitioner from "../../../../../public/assets/Practitioner NFT 1.svg";
import prepFinancing from "../../../../../public/assets/Home Prep Financing.svg";
import applianceInspection from "../../../../../public/assets/appliance inspection.jpg";
// import { useAuthContext } from "@/app/context/authContext";
// import { BASE_URL } from "../../../../constants/endpoints";
// import axios from "axios";

const LandingBotSection = () => {
  const userRole = "Practitioner";
  // const { userRole } = useAuthContext();
  // console.log("userRoleuserRole",userRole)
  const practitionerContent = [
    {
      id: 4,
      img: mintPractitioner,
      link: "/dashboard/mint-practitioner-nft",
      active: true,
    },
    {
      id: 2,
      img: inviteClients,
      link: "",
      active: false,
    },
    {
      id: 3,
      img: certifiedListing,
      link: "",
      active: false,
    },
    {
      id: 1,
      img: applianceInspection,
      link: "",
      active: false,
    },

    {
      id: 5,
      img: floorPlan,
      link: "",
      active: false,
    },
    {
      id: 6,
      img: prepFinancing,
      link: "",
      active: false,
    },
  ];

  // practitioner dashboard bottom data
  const consumerContent = [
    {
      id: 1,
      img: applianceInspection,
      link: "",
      active: false,
    },

    {
      id: 5,
      img: floorPlan,
      link: "",
      active: false,
    },
    {
      id: 6,
      img: prepFinancing,
      link: "",
      active: false,
    },
  ];

  // const [practitionerData, setPractitionerData] = useState([]);
  // const [propertyData, setPropertyData] = useState([]);
  // const [data, setData] = useState([]);

  // fetch data via api for practitioner listings

  // async function fetchPractitionerData() {
  //   try {
  //     const token = localStorage.getItem("access");
  //     const headers = {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     };
  //     const response = await axios.get(
  //       `${BASE_URL}/api/user_practitioners_list`,
  //       {
  //         headers,
  //       }
  //     );
  //     setPractitionerData(response?.data?.results);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // fetch data via api for property listings
  // async function fetchPropertyData() {
  //   try {
  //     const token = localStorage.getItem("access");

  //     const headers = {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     };
  //     const response = await axios.get(`${BASE_URL}/api/user_property_list`, {
  //       headers,
  //     });
  //     setPropertyData(response.data.results);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // useEffect(() => {
  //   if (userRole === "Practitioner") {
  //     fetchPractitionerData();
  //   } else if (userRole === "Consumer") {
  //     fetchPropertyData();
  //   }
  // }, []);

  // useEffect(() => {
  //   if (userRole === "Practitioner") {
  //     if (practitionerData.length !== 0) {
  //       const updatedData = practitionerContent.map((item) => ({
  //         ...item,
  //         active: true,
  //       }));
  //       setData(updatedData);
  //     } else {
  //       setData(practitionerContent);
  //     }
  //   } else if (userRole === "Consumer") {
  //     if (propertyData.length !== 0) {
  //       const updatedData = consumerContent.map((item) => ({
  //         ...item,
  //         active: true,
  //       }));
  //       setData(updatedData);
  //     } else {
  //       setData(consumerContent);
  //     }
  //   }
  // }, [practitionerData, propertyData]);
  // useEffect(()=> {
  //   if(userRole === "Practitioner") {
  //     setData(practitionerContent)
  //   }else {
  //     setData(consumerContent);
  //   }
  // })

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8">
      {/* {data?.map((item, ind) => { */}
      {practitionerContent?.map((item, ind) => {
        return (
          <Link
            href={item.link}
            key={item.id}
            className={`relative ${!item.active && "pointer-events-none"}`}
          >
            <img
              className="w-full duration-500 h-full  ease-in-out hover:scale-[1.03] rounded-[35px]"
              src={item.img}
              alt=""
            />
            <div
              className={`top-0 w-full h-full bg-black/40 absolute rounded-[35px] ${
                !item?.active ? "block" : "hidden"
              }`}
            ></div>
          </Link>
        );
      })}
    </div>
  );
};

export default LandingBotSection;
