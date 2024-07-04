'use client'

import { useEffect, useState } from "react";
import profileImg from "./profile.png";
import apinew from "@/utilities/apinew";
import "@/components/common/CustomCheckbox/CustomCheckbox.css"
import {
  PRACTITIONER_LIST_BY_ALL_STATES,
  PRACTITIONER_LIST_BY_STATE,
} from '@/utilities/endpoints'
import { getToken } from "@/utilities/localStorage";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import SelectInputField from "@/components/formElements/SelectInputField";
import { getStateAgainstCountry } from "@/utilities/countriesAndStatesApi";

const PractitionerListPopup = ({
  setShowPractitionerListPopup,
  setSelectedPractitoner,
  selectedProvince,
  selectedPractitoner,
  selectedCountry,
}) => {
  const [practitionerList, setPractitionerList] = useState([]);
  const [searchPractitionerList, setSearchPractitioner] = useState("");
  const [filterPractitionerList, setFilterPractitioner] = useState([]);
  const [statesAgainstCountry, setStatesAgainstCountry] = useState([]);
  const [selectedStateFromDropdown, setSelectedStateFromDropdown] = useState(
    []
  );
  {console.log("selectedPractitoner",selectedPractitoner)}
  {console.log("selectedProvince",selectedProvince)}
  {console.log("selectedCountry",selectedCountry)}
  console.log("practitionerList", practitionerList)
  console.log("statesAgainstCountry", statesAgainstCountry)
  console.log("selectedStateFromDropdown", selectedStateFromDropdown)
  
  const [Loader, setLoader] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false)

  useEffect(() => {
    const getStates = async () => {
      const resStates = await getStateAgainstCountry(selectedCountry);
      setStatesAgainstCountry(resStates);
    };
    getStates();
  }, [selectedCountry]);

  const getPractitionerList = async () => {
  
    try {
  
      setLoader(true);
      apinew.setJWT(getToken());
      const res = await apinew.get(
        `${
          PRACTITIONER_LIST_BY_STATE + selectedProvince.toLowerCase()
        }`
      );

      setPractitionerList(res.data.data);

      if(!practitionerList.length){
        setUserNotFound(true)
      }
      setLoader(false);
      
    } catch (error) {
      console.log(error);
      setLoader(false);
      
    }
  };
  useEffect(() => {
    getPractitionerList();
    // eslint-disable-next-line
    console.log(selectedProvince)
  }, []);
 

  useEffect(() => {
    const END_POINT =
      selectedStateFromDropdown.value === "united states"
        ? PRACTITIONER_LIST_BY_ALL_STATES
        : PRACTITIONER_LIST_BY_STATE + selectedStateFromDropdown.value 
    const getPractitionerListByState = async () => {
      try {
        setLoader(true);
        
        apinew.setJWT(getToken());
        const res = await apinew.get(
          END_POINT
        );
        setPractitionerList(res.data.data);
            // console.log("working",res.data.data);
        setLoader(false);
       
      } catch (error) {
        console.log(error);
        setLoader(false);
     
      }
    };

    if (selectedStateFromDropdown !== null) {
      getPractitionerListByState();
    }
  }, [selectedStateFromDropdown]);

  const toFilterPractitioner = searchPractitionerList.toLowerCase();

  useEffect(() => {
    let allPractitionerList = practitionerList;
    let tempFilterPractitioner = [...allPractitionerList];

    if (toFilterPractitioner) {
      tempFilterPractitioner = tempFilterPractitioner.filter((curElem) => {
        return (
          `${curElem.practitioner_detail?.firstName?.toLowerCase()} ${curElem.practitioner_detail?.lastName.toLowerCase()}`.includes(
            toFilterPractitioner
          ) ||
          curElem.practitioner_detail?.lastName?.toLowerCase().includes(toFilterPractitioner) ||
          curElem.practitioner_detail?.email?.toLowerCase().includes(toFilterPractitioner) ||
          curElem.practitioner_detail?.companyName?.toLowerCase().includes(toFilterPractitioner)
        );
      });
    }

    // Update the state with the filtered practitioners
    setFilterPractitioner(tempFilterPractitioner);
    // eslint-disable-next-line
  }, [practitionerList, searchPractitionerList]);

  if (selectedPractitoner) {
    setShowPractitionerListPopup(false);
  }

  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const practitionersPerPage = 9;

  useEffect(() => {
    setTotalPages(
      Math.ceil(filterPractitionerList.length / practitionersPerPage)
    );
  }, [practitionersPerPage, filterPractitionerList]);

 
    const handlePageClick = ( page) => {
      
      setCurrentPage(page);
    };
  
    const handlePreviousPage = (event) => {
      event.preventDefault(); 
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    const handleNextPage = (event) => {
      event.preventDefault(); 
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
       
      }
    };
  

  const visibleButtons = 5;
  const rangeStart = Math.max(1, currentPage - Math.floor(visibleButtons / 2));
  const rangeEnd = Math.min(totalPages, rangeStart + visibleButtons - 1);




  const indexOfLastPractitioner = currentPage * practitionersPerPage;
  const indexOfFirstPractitioner =
    indexOfLastPractitioner - practitionersPerPage;
  const currentPractitioners = filterPractitionerList.slice(
    indexOfFirstPractitioner,
    indexOfLastPractitioner
  );


  
  

  return (
    <div className="py-4  px-8 fixed inset-0 flex items-center  justify-center z-50 bg-black/50 ">
      <div className=" max-w-[1250px] max-h-[80vh] overflow-auto mx-auto relative mt-5 p-[1px] rounded-[24px]">
        <div
          style={{
            backgroundColor:'white',
            border: '2px solid #e6d466'
          }}
          className=" py-10 px-[1rem] lg:px-[2rem] xl:px-[2.5rem] min-h-[400px] rounded-[24px]"
        >
          <div
            className="absolute top-[1rem] right-[1rem] text-center"
            onClick={() => {
              setShowPractitionerListPopup(false);
            }}
          >
            <span
              className="material-icons cursor-pointer text-black"
              style={{ width: "2.5rem", height: "2.5rem", fontWeight: "bold" }}
            >
              close
            </span>
          </div>

          <div className="grid grid-cols-4 mt-5">
            <h3 className="col-span-1 max-[1052px]:col-span-4 text-heading-xs sm:text-heading-sm lg:text-[2rem] font-bold leading-[18px] sm:leading-[44px] text-black whitespace-nowrap">
              All Agents
            </h3>
            <div className="col-span-3 max-[1052px]:col-span-4 flex justify-end  items-center flex-wrap gap-4 w-full">
              <div className="w-[280px] pb-1  max-[700px]:my-3">
                <SelectInputField
                  initialValue={"Please Select Search Area"}
                  dropdownList={statesAgainstCountry}
                  selected={selectedStateFromDropdown}
                  setSelected={setSelectedStateFromDropdown}
                  allStates={true}
                />
              </div>

              <div className=" p-0.5 rounded-[24px]"
              style={{border:'1px solid #e6d466'}}
              >
                <input
                  className={` text-black px-4 bg-dark-blue border-0  rounded-[24px] placeholder:font-medium focus:outline-none text-[13px] ${"py-2.5"}`}
                  placeholder={"Search by name, company, email"}
                  value={selectedPractitoner}
                  onChange={(e) => setSearchPractitioner(e.target.value)}
                  style={{ zIndex: -1, width: "275px" }}
                />
              </div>
            </div>
          </div>

          {/* ---- User List -------- */}

          {Loader && (
            <div className="text-center mt-[100px]">
              <LoadingSpinner />
            </div>
          )}

          {!Loader && !practitionerList.length && userNotFound && (
            <div className="text-center mt-[100px] text-black">No practitioner Found!</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-[2.5rem] gap-x-[1rem] gap-y-[2.5rem] ">
            {!Loader &&
              filterPractitionerList &&
              currentPractitioners?.map((practitioner, index) => (
                <div
                  key={index}
                  className="grid  items-center gap-x-2.5 p-[0.8rem] rounded-xl bg-primary"
                >
                  <div className="flex justify-between items-center text-black">
                    <div className="flex ">
                  
                      <img
                        className="rounded-full w-[2.8rem] aspect-square"
                        src={practitioner.practitioner_detail?.headshot || profileImg}
                        alt="Profile"
                      />
                      <div className="ms-2 flex flex-col justify-center ">
                        <h4 className=" text-[0.7rem]">
                          {practitioner.practitioner_detail?.firstName +
                            " " +
                            practitioner.practitioner_detail?.lastName}
                        </h4>
                        <div class="ss:w-[140px] ">
                          <p class="whitespace-normal break-words text-[0.55rem]">
                            {practitioner.practitioner_detail?.companyName}
                          </p>
                        </div>
                        <div class="ss:w-[140px] ">
                          <p class="whitespace-normal break-words text-[0.55rem]">
                            {practitioner.practitioner_detail?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className=""
                      onClick={() => {
                        setSelectedPractitoner({...practitioner?.practitioner_detail, state: practitioner.state, practitioner_nft_id: practitioner.id})
                      }}
                    >
                      <button
                        type="button"
                        className=" w-full px-3 rounded-[12px] text-black  py-1 border-none cursor-pointer bg-[#facc15] hover:bg-[#f1eb83]"
                       
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

            {/* pagination */}
            {!Loader && filterPractitionerList.length > 9 && (
          <div className="w-full mt-8 flex justify-center gap-2 md:gap-4 [&>]:border-0 [&>]:cursor-pointer text-black">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`${
                currentPage === 1 ? "text-black/50" : "text-black"
              } text-[18px] bg-white/0`}
            >
              <span className="flex justify-center px-2 items-center gap-0 md:gap-1 border-solid border-[1px] border-primary rounded-[4px]">
                <span className="material-icons" style={{ fontSize: "1rem" }}>
                  arrow_back_ios
                </span>{" "}
                Prev
              </span>
            </button>
            {rangeStart > 1 && (
              <button className="text-black font-medium bg-white/0">...</button>
            )}
            {[...Array(rangeEnd - rangeStart + 1)].map((_, index) => {
              const pageNumber = rangeStart + index;
              return (
                <button
                  className={`text-black font-medium w-[30px] h-[30px] rounded-full ${
                    pageNumber === currentPage
                      ? "bg-primary hover:bg-primary/70"
                      : "bg-white/0"
                  }`}
                  key={pageNumber}
                  onClick={() => handlePageClick(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
            {rangeEnd < totalPages && (
              <button className="text-black font-medium bg-white/0">...</button>
            )}
            <button
              className={`${
                currentPage === totalPages ? "text-black/50" : "text-black"
              } text-[18px] bg-white/0`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <span className="flex justify-center items-center gap-0 md:gap-1 px-2 border-solid border-[1px] border-primary rounded-[4px]">
                Next{" "}
                <span
                  className="material-icons text-black"
                  style={{ fontSize: "1rem" }}
                >
                  arrow_forward_ios
                </span>
              </span>
            </button>
          </div>
        )}

        </div>
      </div>
    </div>
  );
};

export default PractitionerListPopup;
