import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CiFilter } from "react-icons/ci";
import { MdClear } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";

const FilterPatientsList = ({
  selectedFilters,
  setSelectedFilters,
  isOpenList,
  setIsOpenList,
  month,
  onHandleMonthYearChange,
  year,
  onMonth,
  onYear,
}) => {
  const { t } = useTranslation();
  const filterData = [
    {
      label: t("Gender"),
      value: "gender",
      options: [
        { value: "male", label: t("Male") },
        { value: "female", label: t("Female") },
      ],
    },
    {
      label: t("Clinic"),
      value: "clinic",
      options: [
        { value: "dm", label: "DM" },
        { value: "dew", label: "DEW" },
        { value: "ww", label: "WW" },
        { value: "rb", label: "RB" },
      ],
    },
    {
      label: t("Plan"),
      value: "plan",
      options: [
        { value: "self-pay", label: t("Self Pay") },
        { value: "membership", label: t("Membership") },
        { value: "commercial", label: t("Commercial") },
        { value: "medicare-advantage", label: t("Medicare Advantage") },
        { value: "medicare-traditional", label: t("Medicare Traditional") },
      ],
    },
    {
      label: "AWE",
      value: "aweStatus",
      options: [
        { value: "Need%20to%20Schedule", label: t("Need to Schedule") },
        { value: "Refused", label: t("Refused") },
        { value: "Scheduled", label: t("Scheduled") },
      ],
    },
    {
      label: "ACCE",
      value: "acceStatus",
      options: [
        { value: "Need%20to%20Schedule", label: t("Need to Schedule") },
        { value: "Refused", label: t("Refused") },
        { value: "Scheduled", label: t("Scheduled") },
      ],
    },
    {
      label: "EYE",
      value: "eyeStatus",
      options: [
        { value: "Need%20to%20Schedule", label: t("Need to Schedule") },
        { value: "Refused", label: t("Refused") },
        { value: "Scheduled", label: t("Scheduled") },
        { value: "Not%20Applicable", label: t("Not Applicable") },
      ],
    },
    {
      label: "FOOT",
      value: "footStatus",
      options: [
        { value: "Need%20to%20Schedule", label: t("Need to Schedule") },
        { value: "Refused", label: t("Refused") },
        { value: "Scheduled", label: t("Scheduled") },
        { value: "Not%20Applicable", label: t("Not Applicable") },
      ],
    },
    {
      label: t("Benefit Year"),
      value: "benefityear",
      options: [
        { value: "jan-dec", label: "Jan-Dec" },
        { value: "365%2B1%20days", label: "365 + 1 days" },
      ],
    },
  ];

  // Initialize state to track selected filters for each category
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState(
    filterData.reduce((acc, curr) => {
      acc[curr.value] = [];
      return acc;
    }, {})
  );
  //   const [monthValue, setMonthValue] = useState(null);
  // const [yearValue, setYearValue] = useState(null);
  const [openClearBtn, setOpenClearBtn] = useState(false);

  // useEffect(() => {
  //   // Notify the parent component about month and year changes
  //   onMonth(month);
  //   onYear(year);
  // }, [month, year]);

  const handleToggleDropdown = (index) => {
    // Toggle the isOpen state for the specified dropdown index
    const updatedIsOpenList = [...isOpenList];
    updatedIsOpenList[index] = !updatedIsOpenList[index];
    setIsOpenList(updatedIsOpenList);
  };

  const handleCheckboxChange = (e, option, category) => {
    e.preventDefault();
    const { value, checked } = e.target;

    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [category]: checked
        ? [...(prevFilters[category] || []), value]
        : (prevFilters[category] || []).filter((item) => item !== value),
    }));

    setSelectedCategoryFilters((prevCategoryFilters) => ({
      ...prevCategoryFilters,
      [category]: checked
        ? [...(prevCategoryFilters[category] || []), value]
        : (prevCategoryFilters[category] || []).filter(
            (item) => item !== value
          ),
    }));
  };

  const handleClearButtonClick = () => {
    setSelectedFilters({
      gender: [],
      clinic: [],
      plan: [],
      aweStatus: [],
      acceStatus: [],
      eyeStatus: [],
      footStatus: [],
      benefityear: [],
    });

    // Reset selectedCategoryFilters
    setSelectedCategoryFilters(
      filterData.reduce((acc, curr) => {
        acc[curr.value] = [];
        return acc;
      }, {})
    );
    // onMonth("");
    // onYear("");
    setOpenClearBtn(false);
  };

  return (
    <>
      <div className="absolute">
        {(Object.values(selectedFilters).flat().length > 0 || openClearBtn) && ( // Check if any filter is selected
          <div>
            <button
              onClick={handleClearButtonClick}
              className="border border-gray-300 bg-blue-600 text-white w-[100px] px-3 py-[4px] rounded-md mr-2 flex items-center justify-center gap-2"
            >
              <span className="text-[16px]">{t("Clear")}</span>
              <span>
                <MdClear className="text-[16px]" />
              </span>
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-around w-[100%] text-[16px]">
        <div className="flex  items-center justify-end gap-6 text-sm">
          <div className="flex flex-wrap justify-end gap-y-4">
            <div className="flex items-center justify-center gap-2 w-[100px]">
              <span>
                <CiFilter className="text-[20px]" />
              </span>
              <span>Filter By</span>
            </div>
            {filterData.map((button, index) => (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                key={index}
                className="relative inline-block"
              >
                <button
                  onClick={(e) => {
                    handleToggleDropdown(index);
                  }}
                  className={`border ${
                    selectedCategoryFilters[button.value].length > 0
                      ? "border-black dark:border-blue-500"
                      : "border-gray-300"
                  } w-[140px] px-3 py-[6px] rounded-md dark:bg-[--secondary] mr-4 flex items-center justify-between`}
                >
                  <span>{button.label}</span>
                  <span>
                    <RiArrowDropDownLine className="text-[20px]" />
                  </span>
                </button>
                {isOpenList[index] && (
                  <div className="absolute z-10 top-full left-4 mt-2 #w-[120px] py-2 pl-2 pr-5 bg-white dark:bg-[--secondary] border border-gray-300 rounded-md shadow-md">
                    {button.options.map((option) => (
                      <label
                        key={option.value}
                        className="block cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={(
                            selectedFilters[button.value.toLowerCase()] || []
                          ).includes(option.value)}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              option.value,
                              button.value.toLowerCase()
                            )
                          }
                          className="mr-2"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* <div className="space-x-2 mr-2">
              <input
                value={`${year}-${month.toString().padStart(2, '0')}` || ""}
                onChange={onHandleMonthYearChange}
                onClick={() => setOpenClearBtn(true)}
                type="month"  
                min="1"
                max="12"
                placeholder="Month"
                className="border border-gray-300 w-40  px-3 py-[6px] rounded-md dark:bg-[--secondary]"
              />
              
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPatientsList;
