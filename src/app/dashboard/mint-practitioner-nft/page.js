"use client";

import AutocompleteAddress from "@/components/formElements/AutocompleteAddress";
import CustomButton from "@/components/formElements/CustomButton";
import CustomFileUpload from "@/components/formElements/CustomFileUpload";
import CustomTextArea from "@/components/formElements/CustomTextArea";
import InputField from "@/components/formElements/InputField";
import PaymentPopup from "@/components/popups/paymentPopup";
import api from "@/utilities/api";
import { toast } from "react-hot-toast";
import apinew from "@/utilities/apinew";
import { GET_PROFILE_BY_USERID } from "@/utilities/endpoints";
import { getId, getToken } from "@/utilities/localStorage";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState, useEffect } from "react";
import "./style.css";
import Layout from "../layout";
const MintPractitionerNft = () => {
  const router = useRouter();
  const pendingNftData = null;

  const [loading, setLoading] = useState(false);
  const [showPaymentCard, setShowPaymentCard] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userData, setUserData] = useState({});
  const [data, setData] = useState({});
  const [selectedOption, setSelectedOption] = useState({
    state: "",
    licenseNumber: "",
  });
  const [selectedAddress, setSelectedAddress] = useState(() =>
    pendingNftData ? pendingNftData.address : ""
  );
  const [address, setAddress] = useState(() =>
    pendingNftData ? pendingNftData.address : ""
  );

  const [minPractitionerData, setMinPractitionerData] = useState({
    address: "",
    // agentId: JSON.parse(localStorage.getItem("profile_info"))?.user?.id,
    agentId: null,
    bio: "description",
    email: "settlement",
    image: "",
    licenseType: "",
    license_number: [{ id: "", licenseNumber: "", state: "" }],
    name: "",
    licenseNumber: "",
    state: "",
  });
  useEffect(() => {
    document.title = "Mint NFTs";
    // Check if we are in a browser environment before accessing localStorage
    if (typeof window !== "undefined") {
      const storedProfileInfo = localStorage.getItem("profile_info");
      const agentId = storedProfileInfo
        ? JSON.parse(storedProfileInfo)?.user?.id
        : null;

      setMinPractitionerData((prevData) => ({
        ...prevData,
        agentId: agentId,
      }));
    }
  }, []);

  useEffect(() => {
    setMinPractitionerData({
      address: selectedAddress,
      agentId: JSON.parse(localStorage.getItem("profile_info"))?.user?.id,
      bio: userData?.bio,
      email: userData?.email,
      image: userData?.headshot,
      licenseType: userData?.practitionerType,
      license_number: userData?.states,
      name: `${userData?.firstName} ${userData?.lastName}`,
      licenseNumber: selectedOption?.licenseNumber,
      state: selectedOption?.state,
    });
  }, [userData, selectedOption]);

  useEffect(() => {
    setMinPractitionerData((prev) => {
      return { ...prev, address: selectedAddress };
    });
  }, [selectedAddress]);

  const licenseType = [
    { value: "agent/broker", label: "Real Estate Agent/Broker" },
    { value: "loan officer", label: "Loan Officer / Lender" },
    { value: "title/escrow", label: "Title / Settlement" },
    { value: "mortgage broker", label: "Mortgage Broker" },
    { value: "appraiser", label: "Appraiser" },
  ];

  const getUserData = async () => {
    try {
      api.setJWT(getToken());
      const res = await api.get(`${GET_PROFILE_BY_USERID + getId()}`);
      if (res?.data?.data?.user?.stripe_user_block) {
        toast.error("User has been blocked");
      }
      setUserData(res?.data?.data?.user);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  // stripe Verification Session
  const [stripe, setStripe] = useState({});
  const [liveStripe, setLiveStripe] = useState({});

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );

  const stripeLivePromise = loadStripe(
    process.env.NEXT_PUBLIC_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY
  );

  const getStripe = async () => {
    setStripe(await stripePromise);
  };

  const getLiveStripe = async () => {
    setLiveStripe(await stripeLivePromise);
  };

  useEffect(() => {
    getStripe();
    !!process.env.NEXT_PUBLIC_IS_LIVE_STRIPE && getLiveStripe();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (!minPractitionerData.address) {
        toast.error("Please select the address from dropdown list!");
        return;
      }
      if (!minPractitionerData.licenseNumber) {
        toast.error("Please select the license number.");
        return;
      }

      setLoading(true);

      apinew.setJWT(getToken());
      const res = pendingNftData
        ? await apinew.put(
            `/api/practitioner_nft/${pendingNftData.id}`,
            minPractitionerData
          )
        : await apinew.post(
            "/api/create_practitioner_nft",
            minPractitionerData
          );

      if (res?.status >= 200 && res?.status < 400) {
        // Creating Identity Verification session again
        if (res?.data?.data.client_secret) {
          const { error } = await (process.env.NEXT_PUBLIC_IS_LIVE_STRIPE ==
          "true"
            ? liveStripe
            : stripe
          ).verifyIdentity(res?.data?.data.client_secret);
          if (error) {
            toast.error("Identity Verification went wrong!", {
              duration: 4000,
            });
            console.log("[error]", error);
            setLoading(false);
          } else {
            router.push("/dashboard");
          }
          return;
        }

        pendingNftData?.payment_intent_id && router.push("/dashboard");
        setLoading(false);
        setShowPaymentCard(true);
        setData({
          id: pendingNftData?.id ? pendingNftData?.id : res?.data?.data?.id,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }

    console.log("minPractitionerDataminPractitionerData", minPractitionerData);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setMinPractitionerData((prev) => {
      return { ...prev, [name]: value };
    });
    console.log(name, value);
  }

  console.log(
    "minPractitionerData.licenseType",
    minPractitionerData.licenseType
  );

  return (
    <>
      {showPaymentCard && (
        <PaymentPopup
          isPractitionerNFT={true}
          mintNFTData={data}
          setShowPaymentCard={setShowPaymentCard}
        />
      )}
      <div className="py-4 w-full px-10">
        <h1 className="text-heading-xs mb-4 sm:text-heading-sm lg:text-heading-lg font-semibold leading-[18px] sm:leading-[44px] text-black">
          Mint Practitioner NFT
        </h1>
        <div className=" p-[1px] rounded-[24px]">
          <div
            style={{
              background: "white",
              color: "black",
              border: "1px solid #e6d366",
            }}
            className="w-full py-10 px-[12%] lg:px-[201px] xl:px-[250px] rounded-[24px]"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h2 className="text-heading-xs sm:text-heading-sm font-semibold md:text-heading-lg">
                Step One: Practitioner Information
              </h2>
              <InputField
                inputType="text"
                labelName="Name"
                inputId="name"
                inputName="name"
                inputPlaceholder="Enter your name"
                inputOnChangeFunc={handleChange}
                inputValue={minPractitionerData.name}
                isDisabled={true}
              />
              <InputField
                inputType="email"
                labelName="Email"
                inputName="email"
                inputId="email"
                inputPlaceholder="Enter your Email"
                inputOnChangeFunc={handleChange}
                inputValue={minPractitionerData.email}
                isDisabled={true}
              />

              <AutocompleteAddress
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                address={address}
                setAddress={setAddress}
              />

              <CustomFileUpload
                labelName="Upload a Profile Photo:"
                grayText="Files types supported: JPG/PNG (Max Size: 5MB)"
                formId={7}
                imageUrl={
                  !profilePhoto ? minPractitionerData.image : profilePhoto
                }
                setImageUrl={setProfilePhoto}
                maxFileSize={5}
                disabled={true}
              />
              <CustomTextArea
                inputType="text"
                inputId="Bio"
                padding="h-[80px]"
                inputName="bio"
                labelName="Bio"
                inputOnChangeFunc={handleChange}
                inputValue={minPractitionerData.bio}
                isDisabled={true}
              />

              <div>
                <div className="text-label-xs sm:text-label-sm xl:text-label-lg ">
                  License Type:
                </div>
                <div className="mt-5 space-y-3 grid grid-cols-1 sm:grid-cols-2">
                  {licenseType.map(({ label, value }, i) => {
                    return (
                      <div key={i} className="flex items-center">
                        <input
                          key={i}
                          type="radio"
                          name="licenseType"
                          value={value}
                          id={value}
                          className="form-radio my-radio custom-radio me-2 h-4 w-4 text-green-500 border-green-500 focus:ring-green-500"
                          onChange={handleChange}
                          checked={
                            value == minPractitionerData.licenseType
                              ? true
                              : false
                          }
                          disabled // Use the disabled attribute
                          style={{
                            opacity: "1 !important",
                            color: "blue !important",
                          }}
                        />
                        <label
                          className="text-label-s whitespace-nowrap"
                          htmlFor={value}
                        >
                          {label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-label-xs sm:text-label-sm xl:text-label-lg ">
                  License Number:
                </div>

                {minPractitionerData?.license_number?.map((value, ind) => (
                  <div key={value} className="flex items-center mt-5">
                    <input
                      value={value.licenseNumber}
                      type="radio"
                      name="License"
                      id={value.state}
                      className="form-radio custom-radio me-2 h-4 w-4 text-green-500 border-green-500 focus:ring-green-500"
                      checked={value.state === selectedOption.state}
                      onChange={() => setSelectedOption(value)}
                    />

                    <label className="text-label-s" htmlFor={value.state}>
                      {console.log(selectedOption, "hahahahaha")}
                      {value.licenseNumber}
                    </label>
                  </div>
                ))}
              </div>

              <br />
              <CustomButton
                type="submit"
                text="Mint Practitioner NFT"
                px="sm:px-2.5"
                py="sm:py-3 md:py-3.5"
                fsSm="sm:text-[1rem]"
                fsMd="md:text-[1.25rem]"
                isLoading={loading ? true : null}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default MintPractitionerNft;
