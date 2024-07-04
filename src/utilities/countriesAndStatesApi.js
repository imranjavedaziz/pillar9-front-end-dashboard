import axios from "axios";
import { BASE_URL, GET_ALL_COUNTRIES, GET_STATE_AGAINST_COUNTRY } from "./endpoints";


export const getCountriesList = async () => {
  try {
    const res = await axios.get(`${BASE_URL + GET_ALL_COUNTRIES}`, {});
    return res?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getStateAgainstCountry = async (countryName) => {
  try {
    const res = await axios.get(
      `${BASE_URL + GET_STATE_AGAINST_COUNTRY}${countryName}`,
      {}
    );
    return res?.data?.data;
  } catch (error) {
    console.log(error);
  }
};
