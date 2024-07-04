import React from "react";
import CustomSelectComponent from "./CustomSelectComponent";


const SelectInputField = ({
    labelName,
    grayText,
    dropdownList,
    initialValue,
    inputValue,
    selected,
    setSelected,
    practitionerFormerror,
    allStates,
}) => {
    return (
        <div className="space-y-1.5">
            <label className="text-label-md heading-3 sm:text-[1.2375em] text-black">
                {labelName}
            </label>
            {grayText && (
                <span className="block text-black/60 text-[9px] sm:text-[12px]">
                    {grayText}
                </span>
            )}
            <CustomSelectComponent
                dropdownList={dropdownList}
                initialValue={initialValue}
                inputValue={inputValue}
                selected={selected}
                setSelected={setSelected}
                allStates={allStates}
            />
            {practitionerFormerror && (
                <p className="error mx-4 mt-1 text-[14px] text-[red]">
                    {practitionerFormerror}
                </p>
            )}
        </div>
    );
};

export default SelectInputField;
