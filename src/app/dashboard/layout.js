"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import TopIcons from "@/components/topRightIcons/TopIcons";
import "material-icons/iconfont/material-icons.css";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/authContext";
import CompleteProfilePopup from "@/components/popups/completeProfilePopup/CompleteProfilePopup";
import InactivityTimeout from "@/components/logoutTiming/InactivityTimeout ";

const Layout = (props) => {
  const { setDataResync, profileDetail } = useAuthContext();
  const [controlProfileForm, setControlProfileForm] = useState(true);

  useEffect(()=> {
    setDataResync((prev)=> !prev)
  }, []);
 
  return (
    <>
    <InactivityTimeout />
      {profileDetail && !profileDetail.headshot && controlProfileForm && (
        <CompleteProfilePopup setControlProfileForm={setControlProfileForm} />
      )}
      
      <div className=" bg-no-repeat text-white bg-cover min-h-screen">
        <div className="flex h-full min-h-screen">
          <Sidebar />
          <div className="h-screen w-full overflow-auto bg-white">
            <TopIcons />

            <main className="w-full min-h-screen bg-white">
              
              {props.children}{" "}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
