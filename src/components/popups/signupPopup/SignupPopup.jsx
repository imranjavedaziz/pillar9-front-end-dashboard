import { useAuthContext } from "@/context/authContext";
import CustomButton from "@/components/formElements/CustomButton";


const SignupPopup = (props) => {
    const { handleButtonClick } = props;

    return (
        <>
            {/* Your other signup page content */}
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                <div className="bg-white text-black p-7 sm:p-10  w-[300px] sm:w-[380px] md:w-[571px] rounded-[24px]  ">
                    <h2 className="text-heading-xs sm:text-heading-sm md:text-heading-lg font-semibold ">
                        This account is for?
                    </h2>
                    <p className=" text-[10px] sm:text-[15px] md:text-xl my-3">
                        Please select your category if you are a practitioner then select
                        practitioner otherwise select consumer.
                    </p>
                    <div className="flex justify-center gap-4 sm:gap-8 mt-5 sm:mt-14">
                        <CustomButton
                            text="Consumer"
                            px="px-2.5"
                            py="sm:py-3 md:py-5"
                            fsSm="sm:text-[1rem]"
                            fsMd="md:text-[1.25rem]"
                            handleButtonClick={() => handleButtonClick("Consumer")}
                        />
                        <CustomButton
                            text="Practitioner"
                            px="px-2.5"
                            py="sm:py-3 md:py-5"
                            fsSm="sm:text-[1rem]"
                            fsMd="md:text-[1.25rem]"
                            handleButtonClick={() => handleButtonClick("Practitioner")}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignupPopup;