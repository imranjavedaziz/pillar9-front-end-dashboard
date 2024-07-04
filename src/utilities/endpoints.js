export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const AUTH_LOGIN = "/api/login";

export const NFT_PRACTITIONER = "/api/nft/practitioner";
export const AUTH_REGISTER = "/api/signup";

export const FORGET_PASSWORD = "/api/forgot_password";
export const CHANGE_PASSWORD = "/api/change_password";

export const PROFILE_BY_ID = "/api/profile";
export const VERIFY_OTP = "/api/verify_otp";
export const RESET_PASSWORD = "/api/reset_password/";
export const VERIFY_OTP_PASSWORD = "/api/verify_password_otp";
export const VERIFY_OTP_MFA = "/api/verify_phone_email";

export const GET_PROFILE_BY_USERID = "/api/get_profile?user_id=";
export const MINT_PRACTITIONER_NFT = "/api/practitioner_nft";
export const MINT_PROPERTY_NFT = "/api/property_nft";
export const GET_PRACTITIONER_NFTS = "/api/user_practitioners_list";
export const GET_PROPERTY_NFTS = "/api/user_property_list";
export const EDIT_USER_PROFILE = "/api/profile";
export const VERIFY_EDIT_PROFILE = "/api/verify_edit_profile";
export const RESEND_OTP = "/api/resend_otp";

export const PROPERTY_NFT_DETAIL = "/api/property_nft";
export const PRACTITIONER_NFT_DETAIL = "/api/practitioner_nft";

export const STRIPE_VERIFY_IDENTITY = "/api/stripe_progress_status";

export const PRACTITIONER_NFT_BLOCKCHAIN_DATA =
  "/api/practitioner_nft_blockchain_data?id=";

export const PROPERTY_NFT_BLOCKCHAIN_DATA =
  "/api/property_nft_blockchain_data?id=";

export const VIDEO_WATCHED = "/api/video_watch";

export const GET_ALL_COUNTRIES = "/api/country_list";
export const GET_STATE_AGAINST_COUNTRY = "/api/country_states?country=";
export const ADMIN_PRACT_NFT_LIST = "/api/admin_pract_nft_list";

export const FAILED_PRAC_NFT = "/api/failed_user_property_nft?page=";
export const APPROVED_NFT = "/api/minted_property_nft";

export const ADMIN_NFTS = "/api/admin_nfts";

export const GET_PRACTITIONER_BY_STATE = "/api/practitioners_list?state=";
export const GET_PRACTITIONER_BY_COUNTRY = "/api/practitioners_list?country=";

export const ALL_USERS = "/api/profile";

export const GET_USER_PROPERTY_NFT = "api/list_property_nft?user_id=";
export const GET_USER_PRACTITIONER_NFT = "api/list_practitioner_nft?user_id=";
export const GET_LIST_PROPRTY_NFTS = "/api/list_property_nft_all"
export const GET_LIST_PRACTITIONER_NFTS = "/api/list_practitioner_nft_all"
export const GET_DATA_STATISTICS = "/api/statistics"

export const PRACTITIONER_LIST_BY_ALL_STATES =  "/api/practitioners_list_by_state" 
export const PRACTITIONER_LIST_BY_STATE =  "/api/practitioners_list_by_state?state=" 