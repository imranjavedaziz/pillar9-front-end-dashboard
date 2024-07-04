"use client";

import AutocompleteAddress from "@/components/formElements/AutocompleteAddress";
import CompleteFileUpload from "@/components/formElements/CompleteFileUpload";
import CustomButton from "@/components/formElements/CustomButton";
import CustomFileUpload from "@/components/formElements/CustomFileUpload";
import InputField from "@/components/formElements/InputField";
import SelectInputField from "@/components/formElements/SelectInputField";
import PaymentPopup from "@/components/popups/paymentPopup";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import api from "@/utilities/api";
import { GET_PROFILE_BY_USERID } from "@/utilities/endpoints";
import { getId, getToken } from "@/utilities/localStorage";
import { useAuthContext } from "@/context/authContext";
import apinew from "@/utilities/apinew";
import PractitionerListPopup from "@/components/popups/PractitionerListPopup";
import SinglePractitionerDetailPopup from "@/components/popups/singlePractitionerDetail/SinglePractitionerDetailPopup";

const MintPropertyNftForm = () => {
  const [loading, setLoading] = useState(false);
  const { setEditNftData, pendingNftData, profileDetail, setPendingNftData } =
    useAuthContext();
  const router = useRouter();

  const [viewPractitionerDetail, setViewPractitionerDetail] = useState(false);
  const [selectedPractitoner, setSelectedPractitoner] = useState(null);
  const [showPaymentCard, setShowPaymentCard] = useState(false);
  const [showPractitionerListPopup, setShowPractitionerListPopup] =
    useState(false);

  const [selectProperty, setSelectProperty] = useState(() => ({
    label:
      pendingNftData?.companyName || pendingNftData?.company_document
        ? "Yes"
        : "",
  }));

  const [agent, setAgent] = useState(null);

  const [houseUrl, setHouseUrl] = useState(() =>
    pendingNftData ? pendingNftData.image : null
  );
  const [entityName, setEntityName] = useState(() =>
    pendingNftData ? pendingNftData.companyName : ""
  );
  const [settlementStatment, setSettlementStatement] = useState(() =>
    pendingNftData ? pendingNftData.document : ""
  );
  const [uploadingSettlement, setUploadingSettlement] = useState(false);

  const [address, setAddress] = useState(() =>
    pendingNftData ? pendingNftData.address : ""
  );
  const [latLngPlusCode, setLatLngPlusCode] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(() =>
    pendingNftData ? pendingNftData.address : ""
  );
  const [entityDocument, setEntityDocument] = useState(() =>
    pendingNftData ? pendingNftData.company_document : null
  );
  const [uploadingEntity, setUploadingEntity] = useState(false);

  const [propertyCategoryOptions, setPropertyCategoryOptions] = useState([
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ]);
  const [userData, setUserData] = useState({});
  const [data, setData] = useState({});

  useEffect(() => {
    setAgent(JSON.parse(localStorage.getItem("profile_info"))?.user?.id);
  }, []);

  console.log("999999", agent);

  const [minPropertyData, setMinPropertyData] = useState({
    address: "",
    agentId: pendingNftData?.agentId ? pendingNftData.agentId : agent,
    ...(selectProperty?.label === "Yes" ||
      (pendingNftData?.company_preview && {
        companyName: entityName,
        company_document: entityDocument,
      })),
    agentId: pendingNftData?.agentId ? pendingNftData.agentId : agent,
    ...(selectProperty?.label === "Yes" ||
      (pendingNftData?.company_preview && {
        companyName: entityName,
        company_document: entityDocument,
      })),
    description: "description",
    docCategory: "settlement",
    document: settlementStatment,
    image: houseUrl,
    name: pendingNftData ? pendingNftData.name : "",
    price: 19.99,
    name: pendingNftData ? pendingNftData.name : "",
    price: 19.99,
    title: "",
    practitioner_nft_id: "",
    practitioner_nft_id: "",
    practitioner_id: "",
  });

  useEffect(() => {
    setMinPropertyData((prev) => {
      return {
        ...prev,
        agentId: agent,
        agentId: agent,
        ...(selectProperty?.label === "Yes" && {
          companyName: entityName,
          company_document: entityDocument,
        }),
        image: houseUrl,
        document: settlementStatment,
        address: selectedAddress && selectedAddress,
      };
    });

    if (selectProperty?.label === "No") {
      delete minPropertyData.companyName;
      delete minPropertyData.company_document;
    }
  }, [
    selectProperty,
    houseUrl,
    entityDocument,
    settlementStatment,
    selectedAddress,
    entityName,
  ]);

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
    document.title = "Mint NFTs";
    getUserData();
    return () => setEditNftData(null);
  }, []);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Identity Verification Session
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
    !!process.env.NEXT_PUBLIC_PUBLIC_IS_LIVE_STRIPE && getLiveStripe();
    setShowPaymentCard(false);
  }, []);

  async function handleSubmit(event) {
    try {
      event.preventDefault();

      if (!minPropertyData.name) {
        toast.error("Please fill the name field!");
        return;
      }

      if (!minPropertyData.address) {
        toast.error("Please select the address from dropdown list!");
        return;
      }

      if (minPropertyData.image < 1) {
        toast.error("Please upload the photo of house");
        return;
      }
      if (userData?.stripe_user_block) {
        return toast.error("User has been blocked");
      }

      if (selectProperty?.label === "Yes") {
        if (!minPropertyData.companyName) {
          toast.error("Please fil the Entity Name field!");
          return;
        }
        if (!minPropertyData.company_document) {
          toast.error("Please Upload a legal document for entity!");
          return;
        }
      }

      setLoading(true);

      const data = {
        ...minPropertyData,
        agentId: pendingNftData?.agentId ? pendingNftData.agentId : agent,
        practitioner_nft_id: selectedPractitoner
          ? selectedPractitoner?.practitioner_nft_id
          : null,
        practitioner_id: selectedPractitoner ? selectedPractitoner?.id : null,
      };
      pendingNftData?.address === selectedAddress
        ? (data.title = `${
            pendingNftData?.title?.includes("@")
              ? pendingNftData?.title?.split("@")[0]
              : pendingNftData?.title
          }@${minPropertyData.title}`)
        : (data.title = `${latLngPlusCode.plusCode}@${minPropertyData.title}`);

      apinew.setJWT(getToken());
      const res = pendingNftData
        ? await apinew.put(`/api/property_nft/${pendingNftData.id}`, data)
        : await apinew.post("/api/create_property_nft", data);

      if (res?.status >= 200 && res?.status < 400) {
        // Creating Identity Verification session again
        if (res?.data?.data.client_secret) {
          const { error } = await (process.env
            .NEXT_PUBLIC_PUBLIC_IS_LIVE_STRIPE === "true"
            ? liveStripe
            : stripe
          ).verifyIdentity(res?.data?.data.client_secret);
          if (error) {
            toast.error("Identity Verification went wrong!", {
              duration: 4000,
            });
            router.push("/dashboard");
            console.log("[error]", error);
            setLoading(false);
          } else {
            setShowPaymentCard(false);
            router.push("/dashboard");
          }

          return;
        }

        // For Edititng NFT. If payment is successful then navigate.
        if (pendingNftData?.payment_intent_id) {
          router.push("/dashboard");
        }

        setLoading(false);
        setShowPaymentCard(true);
        setData({ id: res?.data?.data?.id });

        if (pendingNftData) {
          setPendingNftData(null);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setMinPropertyData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  const handleNameChange = (e) => {
    const { name, value } = e.target;

    setMinPropertyData((prev) => {
      const [firstName = "", lastName = ""] = prev.name.split(" ");
      const updatedFirstName = name === "first name" ? value : firstName;
      const updatedLastName = name === "last name" ? value : lastName;
      const updatedName = updatedFirstName + " " + updatedLastName;
      return { ...prev, name: updatedName };
    });
  };

  const handleViewPractitionerDetail = () => {
    setViewPractitionerDetail(true);
  };

  const removePractitioner = () => {
    setSelectedPractitoner(null);
  };

  return (
    <>
      {viewPractitionerDetail && (
        <SinglePractitionerDetailPopup
          practitionerData={selectedPractitoner}
          setViewPractitionerDetail={setViewPractitionerDetail}
        />
      )}

      {showPaymentCard && (
        <PaymentPopup
          mintNFTData={data}
          setShowPaymentCard={setShowPaymentCard}
        />
      )}
      <div className="py-4 w-full px-10">
        <h1 className="mb-5 text-heading-xs sm:text-heading-sm font-semibold lg:text-heading-lg leading-[18px] sm:leading-[44px] text-black">
          Mint Property NFT
        </h1>

        <div className="bg-primary p-[1px] rounded-[24px]">
          <div className="bg-white w-full py-10 px-[12%] lg:px-[201px] xl:px-[250px] rounded-[24px]">
            <form className="flex flex-col gap-5">
              <h2 className="text-heading-xs sm:text-heading-sm font-semibold md:text-heading-lg text-black">
                Step One: Property Information
              </h2>
              <InputField
                inputType="text"
                labelName="Name"
                inputId="name"
                inputPlaceholder="Enter the exact name"
                grayText="Exact Legal name on Government ID"
                inputName="name"
                inputValue={minPropertyData.name}
                inputOnChangeFunc={handleChange}
              />
              <SelectInputField
                labelName="Property:"
                grayText="Is this property in a trust, LLC, or business entity?"
                dropdownList={propertyCategoryOptions}
                initialValue={"No"}
                inputOnChangeFunc={handleChange}
                selected={selectProperty}
                setSelected={setSelectProperty}
              />
              {selectProperty?.label === "Yes" && (
                <>
                  <InputField
                    inputType="text"
                    labelName="Entity Name:"
                    inputId="entityName"
                    inputPlaceholder="Enter the entity name"
                    grayText="Exact name of trust, LLC, or business entity"
                    inputName="companyName"
                    inputValue={minPropertyData?.companyName}
                    inputOnChangeFunc={(e) => setEntityName(e.target.value)}
                  />
                  <CompleteFileUpload
                    labelName="Upload a legal document for entity:"
                    grayText="Files types supported: JPG/PNG/PDF (Max Size: 100 MB)"
                    s3Url={entityDocument}
                    setS3Url={setEntityDocument}
                    uploadingToS3={uploadingEntity}
                    setUploadingToS3={setUploadingEntity}
                    editFilePayload={minPropertyData?.company_document_preview}
                    formId={1}
                    maxFileSize={100}
                    fileType="application/pdf"
                    allowPdf={true}
                    property={true}
                    privateBucket={true}
                  />
                </>
              )}
              <AutocompleteAddress
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                setLatLngPlusCode={setLatLngPlusCode}
                address={address}
                setAddress={setAddress}
                setSelectedProvince={setSelectedProvince}
                setSelectedCountry={setSelectedCountry}
                selectedCountry={selectedCountry}
                latLngPlusCode={latLngPlusCode}
              />
              {profileDetail?.role === "Consumer" && (
                <>
                  {selectedProvince.length > 0 && !selectedPractitoner && (
                    <button
                      type="button"
                      className="text-label-md flex justify-center items-center heading-3 sm:text-[1.2375em] bg-white/0 border-0 outline-none text-black  cursor-pointer w-max"
                      onClick={() => setShowPractitionerListPopup(true)}
                    >
                      <span class="material-icons" style={{ fontSize: "2rem" }}>
                        add
                      </span>
                      <span className="ms-2">Select Agent</span>
                    </button>
                  )}

                  {showPractitionerListPopup && (
                    <PractitionerListPopup
                      setShowPractitionerListPopup={
                        setShowPractitionerListPopup
                      }
                      setSelectedPractitoner={setSelectedPractitoner}
                      selectedPractitoner={selectedPractitoner}
                      selectedProvince={selectedProvince}
                      selectedCountry={selectedCountry}
                    />
                  )}

                  {selectedPractitoner && (
                    <div>
                      <h4 className="text-label-md heading-3 sm:text-[1.2375em] text-black font-normal">
                        Selected Practitioner:
                      </h4>
                      <div className="mt-2  p-0.5 border-2 border-primary rounded-[24px]">
                        <p className="w-full flex gap-2 justify-between text-black px-4 bg-dark-blue border-0 rounded-[24px] placeholder:font-medium focus:outline-none text-[13px] py-2.5">
                          <span className=":text-[13px] h-max my-auto">
                            {" "}
                            {selectedPractitoner.firstName +
                              " " +
                              selectedPractitoner.lastName}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              onClick={handleViewPractitionerDetail}
                              className="cursor-pointer material-icons"
                            >
                              visibility
                            </span>

                            <span
                              onClick={removePractitioner}
                              className="material-icons text-[red] cursor-pointer"
                            >
                              close
                            </span>
                          </div>
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
              <InputField
                labelName="Appartment No:"
                inputType="text"
                inputPlaceholder="Enter apartment number"
                inputId="apartmentNo"
                inputName="title"
                inputValue={minPropertyData.title}
                inputOnChangeFunc={handleChange}
              />
              <CustomFileUpload
                labelName="Upload a photo of the house:"
                grayText="Files types supported: JPG/PNG (Max Size: 5MB)"
                imageUrl={houseUrl}
                setImageUrl={setHouseUrl}
                editFilePayload={minPropertyData.image}
                formId={2}
                maxFileSize={5}
              />
              <CompleteFileUpload
                labelName="Upload a copy of the Settlement Statement (Optional)"
                grayText="Files types supported: JPG/PNG/PDF (Max Size: 100 MB)"
                s3Url={settlementStatment}
                setS3Url={setSettlementStatement}
                uploadingToS3={uploadingSettlement}
                setUploadingToS3={setUploadingSettlement}
                editFilePayload={minPropertyData?.document_preview}
                formId={3}
                maxFileSize={100}
                fileType="application/pdf"
                allowPdf={true}
                property={true}
                privateBucket={true}
              />
              <br />
              <CustomButton
                text={"Mint Property NFT"}
                px="sm:px-2.5"
                py="sm:py-3 md:py-3.5"
                fsSm="sm:text-[1rem]"
                fsMd="md:text-[1.25rem]"
                type="submit"
                isLoading={loading ? true : null}
                handleButtonClick={handleSubmit}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default MintPropertyNftForm;
