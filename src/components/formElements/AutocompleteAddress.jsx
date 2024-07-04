import { GoogleApiWrapper } from "google-maps-react";
import React from "react";
import PlacesAutocomplete, {
    geocodeByAddress,
} from "react-places-autocomplete";
import { OpenLocationCode } from "open-location-code";

const AutocompleteAddress = ({
    google,
    selectedAddress,
    setSelectedAddress,
    setLatLngPlusCode,
    setSelectedProvince,
    address,
    setAddress,
    setSelectedZipcode,
    setSelectedCountry,
    setSelectedCity,
}) => {
    var openLocationCode = new OpenLocationCode();

    const handleChange = (newAddress) => {
        setSelectedAddress("");
        setAddress(newAddress);
    };


    const extractProvinceAndZip = (addressComponents) => {
        let province = "";
        let zipCode = "";
        let country = "";
        let city = "";

        addressComponents.forEach((component) => {
            if (component.types.includes("administrative_area_level_1")) {
                province = component.long_name;
            }
            if (component.types.includes("postal_code")) {
                zipCode = component.long_name;
            }
            if (component.types.includes("country")) {
                country = component.long_name;
            }
            if (component.types.includes("locality")) {
                city = component.long_name;
            }
        });

        return { province, zipCode, country, city };
    };

    const handleSelect = async (selectedAddress) => {
        try {
            const results = await geocodeByAddress(selectedAddress);

            const { province, zipCode, country, city } = extractProvinceAndZip(
                results[0].address_components
            );

            setSelectedAddress(results[0].formatted_address);
            setAddress(results[0].formatted_address);

            setLatLngPlusCode &&
                setLatLngPlusCode({
                    lat: results[0]?.geometry?.location?.lat(),
                    lng: results[0]?.geometry?.location?.lng(),
                    plusCode: openLocationCode?.encode(
                        results[0]?.geometry?.location?.lat(),
                        results[0]?.geometry?.location?.lng()
                    ),
                    place_id: results[0]?.place_id,
                });
            setSelectedProvince && setSelectedProvince(province);
            setSelectedCountry && setSelectedCountry(country);
            setSelectedCity && setSelectedCity(city);
            setSelectedZipcode && setSelectedZipcode(zipCode);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="text-black">
            <label className="text-label-md heading-3 sm:text-[1.2375em]">
                Address
            </label>

            <PlacesAutocomplete
                value={address}
                onChange={handleChange}
                onSelect={handleSelect}
                google={google}
            >
                {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                }) => (
                    <div className="space-y-1.5 relative mt-2">
                        <div className="bg-[#e6d466] p-0.5 rounded-[24px]">
                            <input
                                className={`w-full text-black px-4 bg-white border-0 py-2.5 rounded-[24px] placeholder:font-medium focus:outline-none text-[13px]`}
                                {...getInputProps({ placeholder: "Search address" })}
                                autoComplete="off"
                            />
                        </div>
                        {!selectedAddress && address ? (
                            <ul className="list-none">
                                <div
                                    className="absolute py-2  w-[95%] left-3 rounded-[8px] max-h-[250px] top-15 bg-white  border-[1px] border-solid border-white/30"
                                    style={{ zIndex: 1, overflowY: "scroll" }}
                                >
                                    {suggestions.map((suggestion) => {
                                        const style = {};
                                        return (
                                            <>
                                                <li
                                                    className={`px-3 cursor-pointer text-black ${suggestion.active && "hover:bg-[#fdf4bd]"
                                                        }  text-[12px] sm:text-[14px]`}
                                                    {...getSuggestionItemProps(suggestion, { style })}
                                                >
                                                    {suggestion.description}
                                                </li>
                                            </>
                                        );
                                    })}
                                </div>
                            </ul>
                        ) : null}
                    </div>
                )}
            </PlacesAutocomplete>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
})(AutocompleteAddress);
