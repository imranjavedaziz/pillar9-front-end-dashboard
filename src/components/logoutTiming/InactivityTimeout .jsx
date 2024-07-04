"use client";

import { useAuthContext } from "@/context/authContext";
import { useEffect, useState } from "react";

const InactivityTimeout = () => {
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

  const [remainingTime, setRemainingTime] = useState(INACTIVITY_TIMEOUT);
  const { handleLogout } = useAuthContext();

  useEffect(() => {
    let logoutTimer;

    const resetLogoutTimer = () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }

      logoutTimer = setTimeout(() => {
        // Implement your logout logic here
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("profile_info");
        localStorage.removeItem("access");

        // Redirect to the login page
        window.location.href = "/";
      }, remainingTime);
    };

    resetLogoutTimer(); // Initialize the timer when the component mounts

    const activityEvents = [
      "mousemove",
      "keydown",
      "touchend",
      "touchmove",
      "touchstart",
      "scroll",
    ];

    const handleUserActivity = () => {
      // Reset the timer and update the remaining time
      resetLogoutTimer();
      setRemainingTime(INACTIVITY_TIMEOUT);
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Update the remaining time every second
    const timerInterval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1000);

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });

      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
      clearInterval(timerInterval);
    };
  }, [remainingTime]);

  return null; // This component doesn't render anything to the DOM
};

export default InactivityTimeout;
