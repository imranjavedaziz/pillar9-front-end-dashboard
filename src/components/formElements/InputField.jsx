import React from "react";

function InputField(props) {
    const {
        grayText,
        inputType,
        inputId,
        inputPlaceholder,
        inputName,
        inputValue,
        inputOnChangeFunc,
        errorMsg,
        padding,
        labelName,
        inputOnFocusFunc,
        pattern,
        maxLength,
        onKeyDown,
        onBlur,
        errors,
        touched,
        practitionerFormerror,
        defaultValue,
        isDisabled
    } = props;

    return (
        <div className="space-y-1.5">
            <label
                htmlFor={inputId}
                className="text-label-md heading-3 sm:text-[1.2375em] text-black"
            >
                {labelName}
            </label>
            {grayText && (
                <span className="block text-black/50 text-[9px] sm:text-[12px]">
                    {grayText}
                </span>
            )}
            <div className="bg-[#e6d466] p-0.5 rounded-[24px]">
                <input
                    className={`w-full text-gray-600 bg-white px-4 border-0 rounded-[24px] placeholder:font-medium focus:outline-none text-[13px] ${padding ? padding : "py-2.5"
                        }`}
                    type={inputType}
                    id={inputId}
                    placeholder={inputPlaceholder}
                    name={inputName}
                    value={inputValue}
                    onChange={inputOnChangeFunc}
                    style={{ zIndex: -1 }}
                    onFocus={inputOnFocusFunc}
                    maxLength={maxLength}
                    pattern={pattern}
                    onKeyDown={onKeyDown}
                    onBlur={onBlur}
                    defaultValue={defaultValue}
                    disabled={isDisabled}
                 
                />
            </div>

            {errors && touched ? (
                <p className="error mx-4 mt-1 text-[14px] text-[red]">{errorMsg}</p>
            ) : null}

            {practitionerFormerror && (
                <p className="error mx-4 mt-1 text-[14px] text-[red]">
                    {practitionerFormerror}
                </p>
            )}
        </div>
    );
}

export default InputField;
