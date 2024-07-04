import React, { useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import InputField from "@/components/formElements/InputField";
import SelectInputField from "@/components/formElements/SelectInputField";
import AutocompleteAddress from "@/components/formElements/AutocompleteAddress";
import { toast } from "react-hot-toast";
import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import apinew from "@/utilities/apinew";
import { getId, getToken } from "@/utilities/localStorage";
import { EDIT_USER_PROFILE } from "@/utilities/endpoints";
import { useLocalStorage } from "@/helpers/localStorage/useLocalStorage";

const PractitionerForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    setPractitionerDetails,
    practitionerDetails,
    setDataResync,
    handleLogin,
  } = useAuthContext();
  const router = useRouter();

  const practitionerOptions = [
    { value: "agent/broker", label: "Real Estate Agent/Broker" },
    { value: "loan officer", label: "Loan Officer / Lender" },
    { value: "title/escrow", label: "Title / Settlement" },
    { value: "mortgage broker", label: "Mortgage Broker" },
    { value: "appraiser", label: "Appraiser" },
  ];

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedAddress, setSelectedAddress] = useState();
  const [address, setAddress] = useState();
  const [selectedProvince, setSelectedProvince] = useState();
  const [selectedZipCode, setSelectedZipcode] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [otherZipCode, setOtherZipCode] = useState("");

  const [selectedPractitionerType, setSelectedPractitionerType] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    license: "",
  });

  const [errors, setErrors] = useState({
    companyNameError: "",
    licenseError: "",
    practitionerError: "",
    countryError: "",
    provinceError: "",
    zipCodeError: "",
  });

  const [
    profile_info,
    set_profile_info,
    update_profile_info,
    remove_profile_info,
  ] = useLocalStorage("profile_info", null);

  const handleZipCode = (e) => {
    setOtherZipCode(e.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${name}Error`]: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const { companyName, license, otherState } = formData;

    setErrors((prevErrors) => ({
      ...prevErrors,
      companyNameError:
        companyName.trim() === "" ? "Business Name is required" : "",
      licenseError:
        license.trim() === "" &&
        (selectedPractitionerType.value === "agent/broker" ||
          selectedPractitionerType.value === "loan officer") &&
        "singleCountryChangable".label === "United States"
          ? "License is required"
          : "",
      practitionerError:
        selectedPractitionerType === "" ? "Practitioner type is required" : "",
      countryError:
        "singleCountryChangable" === "" ? "Country is required" : "",
    }));

    isValid =
      companyName.trim() !== "" &&
      (license.trim() !== "" ||
        !(
          selectedPractitionerType.value === "agent/broker" ||
          selectedPractitionerType.value === "loan officer"
        ) ||
        "singleCountryChangable".label !== "United States") &&
      otherState !== "" &&
      selectedPractitionerType !== "" &&
      "singleCountryChangable" !== "";

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      setDataResync(false);
      validateForm();
      if (selectedProvince === "" && selectedCity === "") {
        toast.error("Please add state and city in the address field.");
        setLoading(false);
        return;
      }

      if (selectedZipCode === "" && otherZipCode === "") {
        toast.error("Postal code is required");
        setLoading(false);
        return;
      }
      if (selectedProvince === "") {
        toast.error("Please add state name in the address field.");
        setLoading(false);
        return;
      }
      if (selectedCity === "") {
        toast.error("Please add city name in the address field.");
        setLoading(false);
        return;
      }

      const payload = {
        create_profile: true,
        practitionerType: selectedPractitionerType.value.toLowerCase(),
        states: [
          {
            licenseNumber: formData.license?.length > 1 ? formData.license : "",
            state: selectedProvince.toLowerCase(),
          },
        ],
        country: selectedCountry.toLowerCase(),
        companyName: formData.companyName.toLowerCase(),
        zipCode: selectedZipCode
          ? selectedZipCode.toLowerCase()
          : otherZipCode.toLowerCase(),
        city: selectedCity.toLowerCase(),
        address: selectedAddress.toLowerCase(),
        state: selectedProvince.toLowerCase(),
      };

      apinew.setJWT(getToken());
      const res = await apinew.patch(
        `${EDIT_USER_PROFILE}/${
          JSON.parse(localStorage.getItem("profile_info"))?.user?.id
        }`,
        payload
      );
      if (res?.data?.success) {
        setDataResync(true);
        const old_profile_info = JSON.parse(
          localStorage.getItem("profile_info")
        );

        const new_profile_info = {
          ...old_profile_info,
          user: {
            ...old_profile_info.user,
            practitionerType: payload.practitionerType,
            state: payload.state,
            country: payload.country,
            ...(formData.license?.length > 1 && {
              licenseNumber: formData.license,
            }),
            companyName: payload.companyName,
            city: payload.city,
            zipCode: payload.zipCode,
            address: payload.address,
            create_profile: true,
          },
        };
        localStorage.setItem("profile_info", JSON.stringify(new_profile_info));
        setPractitionerDetails(false);
        setLoading(false);
        handleLogin(localStorage.getItem("access"));
        router.push("/dashboard");
        toast.success("Details Added Successfully");
      }
      setOtherZipCode("");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="lg:w-[450px] pt-[30px] ss:w-[360px] sm:w-[380px] space-y-7 mx-auto"
      >
        <SelectInputField
          labelName="Practitioner:"
          dropdownList={practitionerOptions}
          initialValue="Select practitioner type"
          inputOnChangeFunc={handleChange}
          selected={selectedPractitionerType}
          setSelected={setSelectedPractitionerType}
          practitionerFormerror={errors.practitionerError}
        />
        <InputField
          inputType="text"
          inputId="BusinessName"
          inputPlaceholder="Enter your Business Name"
          inputName="companyName"
          inputValue={formData.companyName}
          inputOnChangeFunc={handleChange}
          labelName="Business Name"
          practitionerFormerror={errors.companyNameError}
        />

        <AutocompleteAddress
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          address={address}
          setAddress={setAddress}
          setSelectedProvince={setSelectedProvince}
          setSelectedCountry={setSelectedCountry}
          selectedCountry={selectedCountry}
          setSelectedZipcode={setSelectedZipcode}
          setSelectedCity={setSelectedCity}
        />

        {selectedZipCode === "" ? (
          <InputField
            inputType="text"
            inputId="selectedZipCode"
            inputPlaceholder="Zip Code"
            inputName="selectedZipCode"
            inputValue={otherZipCode}
            inputOnChangeFunc={handleZipCode}
            labelName="Zip Code"
            practitionerFormerror={errors.zipCodeError}
          />
        ) : null}

        <InputField
          practitionerFormerror={errors.licenseError}
          inputType="text"
          inputId="License Number"
          inputPlaceholder="EF12345678910"
          inputName="license"
          inputValue={formData.license}
          inputOnChangeFunc={handleChange}
          labelName={
            selectedPractitionerType.value === "loan officer"
              ? "NMLS"
              : selectedPractitionerType.value === "title/escrow"
              ? "Title Number"
              : "License Number"
          }
        />
        <button
          type="submit"
          className="text-white cursor-pointer flex item-center justify-center gap-2"
          style={{
            background: "#e6d466",
            borderRadius: "24px",
            width: "100%",
            border: 0,
            padding: "10px",
            fontSize: "15px",
            fontWeight: "bold",
          }}
        >
          Complete Details
          {loading ? <LoadingSpinner /> : null}
        </button>
      </form>
    </>
  );
};

export default PractitionerForm;
