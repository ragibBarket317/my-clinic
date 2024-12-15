import axios from "axios";
import ExcelJS from "exceljs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { calculateDynamicHeight } from "../../utils/calculateHeight";
import { formatDateV3 } from "../../utils/ultimateMegaFinalDateFormatter";
import { useStore } from "../Store";
import AddPatientModal from "../components/AddPatientModal";
import FilterPatientsList from "../components/FiterPatientsList";
import Paginate from "../components/Paginate";
import UserLists from "../components/UserLists";

const LIMIT = 50;

const PatientsPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchData, setSearchData] = useState(
    localStorage.getItem("searchText") || ""
  );
  const { handleSearch, setHandleSearch, searchQuery } = useStore();
  // const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [limit, setLimit] = useState(30);
  const [pageCount, setPageCount] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isOpenList, setIsOpenList] = useState(Array(4).fill(false));
  const [selectedFilters, setSelectedFilters] = useState({
    gender: [],
    clinic: [],
    plan: [],
    aweStatus: [],
    acceStatus: [],
    eyeStatus: [],
    footStatus: [],
    benefityear: [],
  });
  const { auth } = useStore();

  // console.log("Month:", month);
  // console.log("Year:", year);

  const navigate = useNavigate();
  const userRole = auth?.data?.data?.data?.role;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateSearchQuery = (value) => {
    setHandleSearch(value); // Update global state
    setSearchData(value); // Update local state
    localStorage.setItem("searchText", value); // Update local storage
  };

  const patientData = async (searchText) => {
    try {
      setIsLoading(true);
      let url;
      // if (month !== null && year !== null) {
      //   url = `${
      //     import.meta.env.VITE_SERVER_BASE_URL
      //   }/api/v1/patient/getPatients?page=${currPage}&limit=${limit}&year=${year}&month=${month}`;
      // } else if (month !== null) {
      //   url = `${
      //     import.meta.env.VITE_SERVER_BASE_URL
      //   }/api/v1/patient/getPatients?page=${currPage}&limit=${limit}&month=${month}`;
      // } else if (year !== null) {
      //   url = `${
      //     import.meta.env.VITE_SERVER_BASE_URL
      //   }/api/v1/patient/getPatients?page=${currPage}&limit=${limit}&year=${year}`;
      // } else {
      //   url = `${
      //     import.meta.env.VITE_SERVER_BASE_URL
      //   }/api/v1/patient/getPatients?page=${currPage}&limit=${limit}`;
      // }

      url = `${
        import.meta.env.VITE_SERVER_BASE_URL
      }/api/v1/patient/getPatients?page=${currPage}&limit=${limit}`;

      const hasFilters = Object.values(selectedFilters).some(
        (filter) => filter.length > 0
      );

      if (hasFilters) {
        const filters = Object.keys(selectedFilters)
          .filter((key) => selectedFilters[key].length > 0)
          .map((key) => `${key}=${selectedFilters[key].join(",")}`)
          .join("&");

        url += `&${filters}`;
      }

      const response = await axios.post(
        url,
        { searchText },
        { withCredentials: true }
      );
      // console.log("Url", response);

      if (response?.status === 200) {
        setData(response?.data?.data?.patients);
        setFilteredData(response?.data?.data?.patients);

        const filteredPatients = response?.data?.data?.patients.filter(
          (patient) => {
            return (
              selectedFilters.gender.includes(patient.gender) &&
              selectedFilters.clinic.includes(patient.clinic) &&
              selectedFilters.plan.includes(patient.plan) &&
              selectedFilters.aweStatus.includes(patient.aweStatus) &&
              selectedFilters.acceStatus.includes(patient.acceStatus) &&
              selectedFilters.eyeStatus.includes(patient.eyeStatus) &&
              selectedFilters.footStatus.includes(patient.footStatus) &&
              selectedFilters.benefityear.includes(patient.benefityear)
            );
          }
        );
        setFilteredData(filteredPatients);
        setPageCount(response?.data?.data?.totalPages);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const patientDataExcel = async (searchText) => {
    try {
      setIsLoading(true);
      let url;

      url = `${
        import.meta.env.VITE_SERVER_BASE_URL
      }/api/v1/patient/getpatients-excel`;

      const hasFilters = Object.values(selectedFilters).some(
        (filter) => filter.length > 0
      );

      // if (hasFilters) {
      //   const filters = Object.keys(selectedFilters)
      //     .filter((key) => selectedFilters[key].length > 0)
      //     .map((key) => `${key}=${selectedFilters[key].join(",")}`)
      //     .join("&");

      //   url += `&${filters}`;
      // }
      if (hasFilters) {
        const filters = Object.keys(selectedFilters)
          .filter((key) => selectedFilters[key].length > 0)
          .map((key) => `${key}=${selectedFilters[key].join(",")}`)
          .join("&");

        url += `?${filters}`;
      }

      // console.log("Url Excel", url);

      const response = await axios.post(
        url,
        { searchText },
        { withCredentials: true }
      );

      if (response?.status === 200) {
        setExcelData(response?.data?.data?.patients);
        setFilteredData(response?.data?.data?.patients);

        const filteredPatients = response?.data?.data?.patients.filter(
          (patient) => {
            return (
              selectedFilters.gender.includes(patient.gender) &&
              selectedFilters.clinic.includes(patient.clinic) &&
              selectedFilters.plan.includes(patient.plan) &&
              selectedFilters.aweStatus.includes(patient.aweStatus) &&
              selectedFilters.acceStatus.includes(patient.acceStatus) &&
              selectedFilters.eyeStatus.includes(patient.eyeStatus) &&
              selectedFilters.footStatus.includes(patient.footStatus) &&
              selectedFilters.benefityear.includes(patient.benefityear)
            );
          }
        );
        setFilteredData(filteredPatients);
        // setPageCount(response?.data?.data?.totalPages);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("searchText", searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    updateSearchQuery(searchQuery || "");
  }, [searchQuery]);

  useEffect(() => {
    if (searchData !== "") {
      patientData(searchData);
    } else {
      patientData();
    }
  }, [searchData, currPage, selectedFilters, limit, month, year]);

  useEffect(() => {
    patientDataExcel(searchData);
  }, [searchData, selectedFilters, month, year]);

  useEffect(() => {
    setHandleSearch(patientData);
  }, [selectedFilters]);

  useEffect(() => {
    if (searchQuery === "") {
      patientData();
    }
  }, [searchQuery]);
  useEffect(() => {
    if (searchQuery !== "") {
      setCurrPage(1);
    }
  }, [searchQuery]);

  const handlePatientInfo = async () => {
    await patientData();
    return;
  };

  const handleDownload = async () => {
    try {
      if (!data || data.length === 0) {
        console.error("No patient data available for download.");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Patient-List");

      // Add header row
      const headerRow = ["FULL NAME", "DOB", "HF ACCOUNT", "CLINIC", "GENDER"];
      worksheet.addRow(headerRow.map((header) => header.toUpperCase()));

      // Add data rows
      excelData?.forEach((user) => {
        const formattedDate = formatDateV3(user.dob);
        const fullName = user.firstName + " " + user.lastName;
        const userDataRow = [
          fullName?.toUpperCase() || "",
          formattedDate?.toUpperCase() || "",
          user?.accountNumber?.toUpperCase() || "",
          user?.clinic?.toUpperCase() || "",
          user?.gender?.toUpperCase() || "",
        ];
        worksheet.addRow(userDataRow);
      });

      const headerRowNumber = 1;
      const headerCell = worksheet.getRow(headerRowNumber);

      // Check if the row exists, otherwise create it
      if (!headerCell.hasValues) {
        headerCell.getCell(1).value = "FULL NAME";
        headerCell.getCell(2).value = "DOB";
        headerCell.getCell(3).value = "HF ACCOUNT";
        headerCell.getCell(4).value = "CLINIC";
        headerCell.getCell(5).value = "GENDER";
      }

      headerCell.eachCell((cell, colNumber) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "000000" }, // Black background color
        };
        cell.font = {
          color: { argb: "FFFFFF" }, // White text color
          bold: true,
        };
      });

      // Center-align all text in the worksheet
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center" }; // Center-align text
        });
      });

      // Adjust column widths
      worksheet.columns.forEach((column) => {
        column.width = 20; // Set the width of each column to 20
      });

      // Make "HF Account" column bold
      const hfAccountColumn = worksheet.getColumn("C");
      hfAccountColumn.eachCell((cell, rowNumber) => {
        if (rowNumber !== 1) {
          // Skip the header row
          cell.font = {
            bold: true,
          };
        }
      });

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();

      // Create a Blob from the binary data
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Patient-List.xlsx";
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating Excel file:", error);
      // Handle error (e.g., display error message to the user)
    }
  };

  const handleMonthYearChange = (event) => {
    const [year, month] = event.target.value.split("-");
    setMonth(parseInt(month, 10));
    setYear(parseInt(year, 10));
  };

  // const handleDelete = async (_id) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this user?"
  //   );
  //   if (!confirmDelete) return;
  //   try {
  //     const response = await axios.delete(
  //       `${
  //         import.meta.env.VITE_SERVER_BASE_URL
  //       }/api/v1/patient/delete-patient/${_id}`,
  //       { withCredentials: true }
  //     );

  //     if (response?.status === 200) {
  //       toast.success("Patient deleted successfully!");
  //       setData((prevData) => prevData.filter((item) => item._id !== _id));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching patient data:", error);
  //   }
  // };

  return (
    <>
      <div className="flex justify-end mb-6 gap-2">
        <div>
          {isLoading ? (
            <button
              type="button"
              className="bg-theme text-theme-text py-2 px-4 flex justify-between items-center rounded-md font-bold transition-all hover:opacity-90"
              disabled
            >
              <svg
                className="animate-spin h-5 w-5 mr-3"
                viewBox="0 0 800 800"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="400"
                  cy="400"
                  fill="none"
                  r="200"
                  strokeWidth="80"
                  stroke="#ffffff"
                  strokeDasharray="1008 1400"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-bold text-[14px]">
                {t("Processing")}...
              </span>
            </button>
          ) : (
            <button
              className="rounded-md p-2 px-4 text-[14px] bg-theme font-bold text-theme-text transition-all hover:opacity-90"
              onClick={excelData.length > 0 ? handleDownload : ""}
            >
              {t("Download Excel")}
            </button>
          )}
        </div>
        <div>
          {userRole !== "provider" && (
            <button
              onClick={openModal}
              className="rounded-md p-2 px-4 text-[14px] bg-theme text-theme-text font-bold transition-all hover:opacity-90 "
            >
              {t("Add Patient")}
            </button>
          )}
        </div>
      </div>
      <div
        onClick={(e) => {
          setIsOpenList(Array(4).fill(false));
        }}
        className="lato"
        style={{ height: calculateDynamicHeight(data.length) }}
      >
        <div>
          <div className="examinations space-y-6 bg-white dark:bg-[--secondary] shadow-xl px-8 py-6 rounded-lg text-[12px]">
            <div className="flex items-center justify-end mb-12 w-full">
              <div>
                <FilterPatientsList
                  isOpenList={isOpenList}
                  setIsOpenList={setIsOpenList}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  month={month}
                  year={year}
                  onMonth={setMonth}
                  onYear={setYear}
                  onHandleMonthYearChange={handleMonthYearChange}
                />
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-[85px] w-[85px] mr-3"
                  viewBox="0 0 800 800"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="400"
                    cy="400"
                    fill="none"
                    r="200"
                    strokeWidth="60"
                    stroke="#00308F"
                    strokeDasharray="1008 1400"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-full">
                <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-4 mb-4 rounded-sm text-[16px] font-semibold">
                  <p className="w-[15%]">{t("Name")}</p>
                  <p className="w-[10%]">{t("Gender")}</p>
                  <p className="w-[20%]">{t("Date of Birth")}</p>
                  <p className="w-[10%]">{t("Clinic")}</p>
                  <p className="w-[20%]">{t("Plan")}</p>
                  <p className="w-[15%]">{t("Benefit Year")}</p>
                  {/* <p className="w-[8%]">Details</p> */}
                </div>
                {data.length > 0 ? (
                  data.map((user) => (
                    <UserLists
                      key={user._id}
                      user={user}
                      data={filteredData}
                      onData={setFilteredData}
                      // onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div>
                    {searchQuery === "" ? (
                      <h2 className="text-[14px]">
                        {t("There are no patients here")}.
                      </h2>
                    ) : (
                      <h2 className="text-[14px]">
                        {t("Search item is not found")}.
                      </h2>
                    )}
                  </div>
                )}
                <div className="flex justify-items-start items-center gap-2 my-8">
                  <p>{t("Records Per Page")}: </p>
                  <div>
                    <select
                      id="plan"
                      className="border border-gray-300 px-3 py-2 w-full rounded-md dark:bg-[--secondary]"
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                    >
                      <option value="" default disabled>
                        {t("Select Limit")}
                      </option>
                      <option value={30} default>
                        30
                      </option>
                      <option value={35}>35</option>
                      <option value={40}>40</option>
                      <option value={45}>45</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Paginate
                    limit={LIMIT}
                    setCurrPage={setCurrPage}
                    currPage={currPage}
                    pageCount={pageCount}
                  />
                </div>
              </div>
            )}
            <div>
              <AddPatientModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onHandlePatientInfo={handlePatientInfo}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientsPage;
