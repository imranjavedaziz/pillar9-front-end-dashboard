"use client";

import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import qs from "qs";
import { useEffect, useState } from "react";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { toast } from "react-hot-toast";
import InputField from "@/components/formElements/InputField";
import CustomButton from "@/components/formElements/CustomButton";
import {
  BASE_URL,
  MINT_PRACTITIONER_NFT,
  MINT_PROPERTY_NFT,
} from "@/utilities/endpoints";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authContext";
import { getToken } from "@/utilities/localStorage";

const PaymentPopup = ({
  isPractitionerNFT,
  mintNFTData,
  setShowPaymentCard,
}) => {
  const [loading, setLoading] = useState(false);
  const { profileDetail } = useAuthContext();

  let mintToastMessage = "";
  isPractitionerNFT
    ? (mintToastMessage =
        "Congratulations! Your identity is being verified, once it is done your Practitioner NFT will be minted.")
    : (mintToastMessage =
        "Thank you for your order! Your property NFT will be minted as soon as the verification process is complete. For your security, the verification process may take up to three days.");

  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focus, setFocus] = useState("");
  const [stripe, setStripe] = useState({});
  const [liveStripe, setLiveStripe] = useState({});
  const { setMinting } = useAuthContext();

  const router = useRouter();

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
  }, []);

  const handleChange = (e) => {
    const target = e.target.name;
    const value = e.target.value;

    if (target === "number") {
      const inputValue = value.replace(/[^0-9]/g, "");
      let formattedValue = "";

      for (let i = 0; i < inputValue.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += " ";
        }
        formattedValue += inputValue[i];
      }

      setNumber(formattedValue);
      setFocus(target);
    }

    if (target === "name") {
      setName(value);
      setFocus(target);
    }
    if (target === "expiry") {
      const inputValue = e.target.value.replace(/[^0-9]/g, "").substring(0, 4);
      let formattedValue = "";

      for (let i = 0; i < inputValue.length; i++) {
        if (i === 2) {
          formattedValue += "/" + inputValue[i];
        } else {
          formattedValue += inputValue[i];
        }
      }

      setExpiry(formattedValue);
      setFocus(target);
    }
    if (target === "cvc") {
      setCvc(value.replace(/[^0-9]/g, ""));
    }
  };

  const handleFocus = (e) => {
    const target = e.target.name;
    if (target === "number") {
      setFocus(target);
    }
    if (target === "name") {
      setFocus(target);
    }
    if (target === "expiry") {
      setFocus(target);
    }
    if (target === "cvc") {
      setFocus(target);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer " +
        (process.env.NEXT_PUBLIC_PUBLIC_IS_LIVE_STRIPE == "true"
          ? process.env.NEXT_PUBLIC_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY
          : process.env.NEXT_PUBLIC_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    );
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var cardData = qs.stringify({
      "card[number]": number,
      "card[exp_month]": expiry.split("/")[0],
      "card[exp_year]": expiry.split("/")[1],
      "card[cvc]": cvc,
      type: "card",
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: cardData,
      redirect: "follow",
    };
    fetch("https://api.stripe.com/v1/payment_methods", requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result?.error) {
          setLoading(false);
          toast.error(result?.error?.message);
          return;
        }
        try {
          const res = await axios.post(
            isPractitionerNFT
              ? BASE_URL + MINT_PRACTITIONER_NFT
              : BASE_URL + MINT_PROPERTY_NFT,
            {
              payment_intent_id: result?.id,
              "3d_secure": false,
              [isPractitionerNFT ? "practitioner_nft_id" : "property_nft_id"]:
                mintNFTData?.id,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
              },
            }
          );

          if (res?.data?.data?.requires_action) {
            const confirmationData = await (process.env
              .NEXT_PUBLIC_PUBLIC_IS_LIVE_STRIPE == "true"
              ? liveStripe
              : stripe
            ).confirmCardPayment(res?.data?.data?.payment_intent_client_secret);

            if (confirmationData?.error) {
              setLoading(false);
              toast.error(confirmationData?.error?.message);
              return;
            }
            const mintNftAfterPayment = await axios.post(
              isPractitionerNFT
                ? BASE_URL + MINT_PRACTITIONER_NFT
                : BASE_URL + MINT_PROPERTY_NFT,
              {
                payment_intent_id: confirmationData?.paymentIntent?.id,
                "3d_secure": true,
                [isPractitionerNFT ? "practitioner_nft_id" : "property_nft_id"]:
                  mintNFTData?.id,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
              }
            );

            if (mintNftAfterPayment?.data?.data?.identity_secret) {
              const { error } = await (process.env
                .NEXT_PUBLIC_PUBLIC_IS_LIVE_STRIPE == "true"
                ? liveStripe
                : stripe
              ).verifyIdentity(
                mintNftAfterPayment?.data?.data?.identity_secret
              );
              if (error) {
                setLoading(false);
                console.log("[error]", error);
              } else {
                setLoading(false);
              }
              setLoading(false);
              setShowPaymentCard(false);

              return;
            }

            if (mintNftAfterPayment?.data?.data == "") {
              setMinting(true);
              setTimeout(() => {
                setLoading(false);
                setShowPaymentCard(false);
                router.push("/dashboard");
                setTimeout(() => {
                  toast.success(mintToastMessage, {
                    duration: 4000,
                  });
                }, 4000);
              }, 4000);

              return;
            }
          }
          console.log("mintNftAfterPayment?.data?.data");

          if (res?.data?.data?.identity_secret) {
            const { error } = await (process.env
              .NEXT_PUBLIC_PUBLIC_IS_LIVE_STRIPE == "true"
              ? liveStripe
              : stripe
            ).verifyIdentity(res?.data?.data?.identity_secret);
            if (error) {
              setLoading(false);
              console.log("[error]", error);
            } else {
              setMinting(true);

              setTimeout(() => {
                setLoading(false);
                router.push("/dashboard");
                setTimeout(() => {
                  toast.success(mintToastMessage, {
                    duration: 4000,
                  });
                }, 4000);
                setLoading(false);
                setShowPaymentCard(false);
              }, 4000);
            }

            return;
          }
          console.log("res?.data?.data", res?.data);
          if (res?.data?.data == "") {
            setMinting(true);
            setTimeout(() => {
              setLoading(false);
              setShowPaymentCard(false);
              router.push("/dashboard");
              setTimeout(() => {
                toast.success(mintToastMessage, {
                  duration: 4000,
                });
              }, 4000);
            }, 4000);
          }
        } catch (error) {
          setLoading(false);
          console.log(error);
          if (typeof error?.response?.data?.message == "string") {
            if (error?.response?.data?.message.includes(":")) {
              toast.error(error?.response?.data?.message?.split(":")[1]);
              return;
            }
          }
          toast.success(error?.response?.data?.message, {
            duration: 4000,
          });
          router.push("/dashboard");
          setShowPaymentCard(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleCrossClick = () => {
    setShowPaymentCard(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className=" bg-white p-7 sm:p-10 relative  w-[300px] sm:w-[380px] md:w-[571px] rounded-[24px] text-black max-h-[700px] ">
        <div className="absolute top-3 right-3" onClick={handleCrossClick}>
          <span
            className="material-icons sm:w-[22px] sm:h-[22px] absolute right-[1rem]  top-[1rem] font-bold cursor-pointer"
            style={{ fontSize: "2rem", fontWeight: "bold" }}
          >
            close
          </span>
        </div>
        <h2 className="text-heading-xs sm:text-heading-sm md:text-heading-lg font-semibold text-center">
          {isPractitionerNFT ? "Practitioner NFT $50" : "Property NFT $19.99"}
        </h2>
        <div className="h-[70vh] overflow-auto pr-2">
          <p className=" text-[10px] sm:text-[15px] md:text-xl my-3 text-center">
            Please enter your payment information
          </p>

          <div className="my-4 space-y-4 ">
            <div className="w-full">
              <Cards
                cvc={cvc}
                expiry={expiry}
                focused={focus}
                name={name}
                number={number}
              />
            </div>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <InputField
                inputType="tel"
                inputId="number"
                inputName="number"
                inputPlaceholder="Card Number"
                inputValue={number}
                inputOnChangeFunc={handleChange}
                inputOnFocusFunc={handleFocus}
                maxLength={19}
                pattern="\d{4} \d{4} \d{4} \d{4}"
              />
              <InputField
                inputType="text"
                inputId="name"
                inputName="name"
                inputPlaceholder="Name"
                inputValue={name}
                inputOnChangeFunc={handleChange}
                inputOnFocusFunc={handleFocus}
              />
              <InputField
                inputType="tel"
                inputId="expiry"
                inputName="expiry"
                inputPlaceholder="Valid Thru (MM/YY)"
                inputValue={expiry}
                inputOnChangeFunc={handleChange}
                inputOnFocusFunc={handleFocus}
              />
              <InputField
                inputType="tel"
                inputId="cvc"
                inputName="cvc"
                inputPlaceholder="CVC"
                inputValue={cvc}
                inputOnChangeFunc={handleChange}
                inputOnFocusFunc={handleFocus}
                maxLength={4}
              />
              <CustomButton
                text="Pay and continue to verification"
                type="submit"
                isLoading={loading ? true : null}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;
