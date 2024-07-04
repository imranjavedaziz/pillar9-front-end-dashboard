import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./InputPhone.css";

const InputPhone = (props) => {
  const { onBlur, errorMsg, errors, touched, inputValue, setFieldValue } =
    props;

  return (
    <>
      <div className="mt-2">
        <PhoneInput
          country="ca"
          onBlur={onBlur}
          enableSearch={true}
          value={inputValue}
          onChange={(phone) => setFieldValue("phoneNumber", phone)}
          buttonClass="hover:bg-[yellow]"
          buttonStyle={{
            backgroundColor: "transparent",
            color: "black",
            border: "none",
            paddingLeft: "8px",
            ":hover": {
              background: "transparent",
            },
            marginTop: 0,
          }}
          inputStyle={{
            color: "rgb(75,85,99)",
            width: "100%",
            borderRadius: "24px",
            border: "2px solid #e6d466",
            background: "white",
            height: "42px",
            borderImage: "2px solid linear-gradient(to right, red, yellow)",
            borderImageSlice: "1",
          }}
          dropdownStyle={{
            background: "white",
            ":hover": {
              background: "transparent",
            },
          }}
          searchStyle={{
            background: "white",
            color: "black",
          }}
        />
        {errors && touched ? (
          <p className="error mx-4 mt-1 text-[14px] text-[red]">{errorMsg}</p>
        ) : null}
      </div>
    </>
  );
};

export default InputPhone;
