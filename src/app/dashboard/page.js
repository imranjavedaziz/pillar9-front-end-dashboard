"use client";

import { useEffect } from "react";
import NftWallet from "./nft-wallet/page";
import Link from "next/link";
import { useAuthContext } from "@/context/authContext";

const Page = () => {
  const { profileDetail } = useAuthContext();
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <>
      <div className="w-full flex justify-end gap-3 px-2 sm:px-10">
        <Link href={"/dashboard/mint-property-nft"}>
          <button className="bg-primary px-6 py-2 rounded-lg">
            Mint Property NFT
          </button>
        </Link>
        {profileDetail?.role === "Practitioner" && (
          <Link href={"/dashboard/mint-practitioner-nft"}>
            <button className="bg-primary px-6 py-2 rounded-lg">
              Mint Practitioner NFT
            </button>
          </Link>
        )}
      </div>
      <NftWallet />
    </>
  );
};

export default Page;
