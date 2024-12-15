import axios from "axios";
import ExcelJS from "exceljs";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { PiNotepad } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { calculateAge } from "../../utils/ageCalculation";
import {
  formatDateV3,
  ultimateDateFormatter,
} from "../../utils/ultimateMegaFinalDateFormatter";
import { useStore } from "../Store";
import { Examinations } from "./Examinations";
import { Labs } from "./Labs";
import MedicalHistory from "./MedicalHistory";
import NotificationPopup from "./NotificationPopup";

export const Profile = ({ id }) => {
  const [patientData, setPatientData] = useState({});
  const { t } = useTranslation();

  const {
    firstname,
    setFirstname,
    lastName,
    setLastname,
    dob,
    account,
    patientsAge,
    gender,
    setGender,
    setAccount,
    clinic,
    setClinic,
    setDob,
    setPatientsAge,
    dm2,
    plan,
    benefityear,
    setBenefityear,
    setPlan,
    auth,
  } = useStore();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isOpenNote, setIsOpenNote] = useState(
    localStorage.getItem("isOpenNote") === "false" ? false : true
  );
  const userRole = auth?.data?.data?.data?.role;
  const fullName = firstname + " " + lastName;
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("isOpenNote", isOpenNote);
  }, [isOpenNote]);

  // const openPopup = () => {
  //   setIsOpenNote(!isOpenNote);
  // };

  const notificationRef = useRef(null);

  useEffect(() => {
    const closePopupOnClickOutside = (e) => {
      // Check if the clicked element is outside the notification popup
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setIsOpenNote(false);
      }
    };

    // Attach the event listener when the popup is open
    if (isOpenNote) {
      document.addEventListener("mousedown", closePopupOnClickOutside);
    } else {
      // Remove the event listener when the popup is closed to prevent memory leaks
      document.removeEventListener("mousedown", closePopupOnClickOutside);
    }

    return () => {
      // Cleanup by removing the event listener when the component is unmounted
      document.removeEventListener("mousedown", closePopupOnClickOutside);
    };
  }, [isOpenNote]);

  const togglePopup = () => {
    setIsOpenNote((prevState) => !prevState);
  };
  // const closePopupOnClickPiNotepad = () => {
  //   setIsOpenNote(false);
  // };

  const formattedDate = formatDateV3(patientData.dob);
  // console.log(dob);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/patient/get-patient/${id}`,
          { withCredentials: true }
        );

        const data = response?.data?.data;

        if (response?.status === 200) {
          setPatientData(data);
          setFirstname(data.firstName);
          setLastname(data.lastName);
          setGender(data.gender);
          setAccount(data.accountNumber);
          setDob(data.dob);
          setPatientsAge(data.age);
          setClinic(data.clinic);
          setPlan(data.plan);
          setBenefityear(data.benefityear);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, []);

  const handleUpdatePatient = async () => {
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/patient/update-patient/${id}`,
        {
          firstName: firstname,
          lastName,
          gender,
          dob,
          age: calculateAge(dob),
          clinic,
          accountNumber: account,
          plan,
          benefityear,
        },
        { withCredentials: true }
      );

      const data = response?.data?.data;
      // console.log("Demo", data);

      if (response?.status === 200) {
        setPatientData(data);
        setShowEditProfile(false);

        setFirstname(data.firstName);
        setLastname(data.lastName);
        setGender(data.gender);
        setAccount(data.accountNumber);
        setDob(data.dob);
        setPatientsAge(data.age);
        setClinic(data.clinic);
        setPlan(data.plan);
        setBenefityear(data.benefityear);
        toast.success(`Updated ${firstname}'s profile`, {
          className: "toast-custom",
        });
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      toast.error("Something went wrong", {
        className: "toast-custom",
      });
    }
  };

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Profile");

    // Your profile data
    const data = [
      ["FULL NAME", "DOB", "HF ACCOUNT", "CLINIC", "GENDER"],
      [
        fullName.toUpperCase(),
        formattedDate.toUpperCase(),
        account.toUpperCase(),
        clinic.toUpperCase(),
        gender.toUpperCase(),
      ],
    ];

    // Add data to the worksheet
    worksheet.addRows(data);

    // Customize header background color (cell A1)
    const firstRow = worksheet.getRow(1);
    firstRow.eachCell((cell) => {
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
    const hfAccountColumn = worksheet.getColumn("D");
    hfAccountColumn.eachCell((cell, rowNumber) => {
      if (rowNumber !== 1) {
        // Skip the header row
        cell.font = {
          bold: true,
        };
      }
    });

    try {
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
      link.download = "profile.xlsx";
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating Excel file:", error);
      // Handle error (e.g., display error message to the user)
    }
  };

  const handleGoback = () => {
    navigate("/patients");
  };

  const handleDelete = async () => {
    toast.warn(
      <div>
        <p className="mb-4">{t("Are you sure you want to delete?")}</p>
        <button
          onClick={handleDeletePatient}
          className="bg-theme py-[2px] px-[8px] rounded-md text-white mr-2"
        >
          {t("Yes")}
        </button>
        <button
          onClick={() => toast.dismiss()}
          className="bg-red-600 py-[2px] px-[8px] rounded-md text-white mr-2"
        >
          {t("No")}
        </button>{" "}
        {/* Dismiss the toast with ID */}
      </div>,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: id, // Use the note ID as the toast ID
        icon: false,
      }
    );
  };

  const handleDeletePatient = async () => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/patient/delete-patient/${id}`,
        { withCredentials: true }
      );

      if (response?.status === 200) {
        navigate("/patients");
        toast.dismiss();
        toast.success("Patient deleted successfully!");
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  // console.log("Patient Data: ", patientData);

  return (
    <div>
      <div className="flex justify-end">
        <button
          className="rounded-md p-2 px-4 text-[14px] bg-theme font-bold text-theme-text transition-all hover:opacity-90 mr-2"
          onClick={handleDownload}
        >
          {t("Download Excel")}
        </button>
        <button
          className="rounded-md p-2 px-4 text-[14px] bg-red-500 font-bold text-white transition-all hover:opacity-90 "
          onClick={handleDelete}
        >
          <div className="flex justify-between items-center">
            <span>
              <MdDelete className="text-[18px]" />
            </span>
            <span>{t("Delete Patient")}</span>
          </div>
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="breadcrumb py-8 text-lg">
          <span onClick={handleGoback} className="cursor-pointer">
            {t("Patients")}
          </span>{" "}
          &nbsp; &gt; &nbsp;{" "}
          <span className="text-theme font-medium capitalize">{`${firstname} ${lastName}`}</span>
        </div>
        <div className="relative inline-block">
          <button
            className="text-[26px] z-10 mr-10 bg-gray-200 dark:bg-gray-800  rounded-full p-2"
            onClick={() => {
              togglePopup();
              // closePopupOnClickPiNotepad(); // Close popup when PiNotepad button is clicked
            }}
          >
            <PiNotepad />
          </button>
          <div className="absolute top-0 right-[28px] w-6 h-6  bg-red-500 rounded-full p-1 text-[12px] font-bold flex justify-center items-center text-white">
            {patientData?.openedNotes?.length || 0}
          </div>
          {isOpenNote && (
            <div ref={notificationRef}>
              <NotificationPopup
                id={id}
                patientData={patientData}
                onPatientData={setPatientData}
              />
            </div>
          )}
        </div>
      </div>
      <div className="mainProfile">
        <div className="flex justify-between items-start pb-12">
          <div className="left w-[40%]">
            <div className="demographics h-[380px] space-y-6 bg-white dark:bg-[--secondary] dark:text-[--text] shadow-lg px-8 py-6 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg text-slate-900 dark:text-[--text]">
                  {t("Demographics")}
                </span>
                <span className="hover:scale-105 hover:text-theme duration-300 cursor-pointer">
                  {userRole !== "provider" &&
                    (showEditProfile ? (
                      <FiCheckCircle onClick={handleUpdatePatient} size={20} />
                    ) : (
                      <FiEdit3
                        onClick={() => setShowEditProfile(true)}
                        size={20}
                      />
                    ))}
                </span>
              </div>

              <div className="infoBox space-y-4 text-[14px] capitalize">
                <div className="row1 flex items-center gap-4">
                  <div className="box1 w-[50%]">
                    <p className="text-gray-500 font-medium mb-1">
                      {t("First Name")}
                    </p>
                    {showEditProfile ? (
                      <>
                        <input
                          className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                        />
                      </>
                    ) : (
                      <p className="font-medium">{firstname}</p>
                    )}
                  </div>
                  <div className="box2 w-[50%]">
                    <p className="text-gray-500 font-medium mb-1">
                      {t("Last Name")}
                    </p>
                    {showEditProfile ? (
                      <>
                        <input
                          className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastname(e.target.value)}
                        />
                      </>
                    ) : (
                      <p className="font-medium">{lastName}</p>
                    )}
                  </div>
                </div>
                <div className="row2 flex items-center gap-4">
                  <div className="box1 w-[50%]">
                    <p className="text-gray-500 font-medium mb-1">
                      {t("Gender")}
                    </p>
                    {showEditProfile ? (
                      <select
                        className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="male">{t("Male")}</option>
                        <option value="female">{t("Female")}</option>
                      </select>
                    ) : (
                      <p className="font-medium">{gender}</p>
                    )}
                  </div>
                  <div className="box2 w-[50%]">
                    <p className="text-gray-500 font-medium mb-1">DOB</p>
                    <p className="font-medium">
                      {showEditProfile ? (
                        <input
                          className="dark:bg-[--secondary]"
                          value={ultimateDateFormatter(dob)}
                          onChange={(e) => {
                            setDob(e.target.value);
                            setPatientsAge(calculateAge(e.target.value));
                          }}
                          type="date"
                          name=""
                          id=""
                        />
                      ) : (
                        `${formatDateV3(
                          patientData.dob
                        )} (${patientsAge} years)`
                      )}
                    </p>
                  </div>
                </div>
                <div className="row3 flex items-center gap-4">
                  <div className="box1 w-[50%]">
                    <p className="text-gray-500 font-medium mb-1">
                      {t("Account")}
                    </p>
                    {showEditProfile ? (
                      <>
                        <input
                          className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                          type="text"
                          name="account"
                          id="account"
                          value={account}
                          onChange={(e) => setAccount(e.target.value)}
                        />
                      </>
                    ) : (
                      <p className="font-medium">{account}</p>
                    )}
                  </div>
                  <div className="box2 w-[50%] uppercase">
                    <p className="text-gray-500 font-medium mb-1">
                      {t("Clinic")}
                    </p>
                    {showEditProfile ? (
                      <select
                        className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                        value={clinic}
                        onChange={(e) => setClinic(e.target.value)}
                      >
                        <option value="dm">DM</option>
                        <option value="dew">Dew</option>
                        <option value="ww">WW</option>
                        <option value="rb">RB</option>
                      </select>
                    ) : (
                      <p className="font-medium">{patientData.clinic}</p>
                    )}
                  </div>
                </div>
                <div className="row1 flex items-center gap-4">
                  <div className="box1 w-[50%]">
                    <p className="text-gray-500 font-medium mb-1">
                      {t("Plan")}
                    </p>
                    {showEditProfile ? (
                      <select
                        className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                      >
                        <option value="Self Pay">{t("Self Pay")}</option>
                        <option value="membership">{t("Membership")}</option>
                        <option value="commercial">{t("Commercial")}</option>
                        <option value="medicare-advantage">
                          {t("Medicare-Advantage")}
                        </option>
                        <option value="medicare-traditional">
                          {t("Medicare-Traditional")}
                        </option>
                      </select>
                    ) : (
                      <p className="font-medium">{plan}</p>
                    )}
                  </div>
                  <div className="box2 w-[50%]">
                    <p className="text-gray-500 font-medium mb-1">
                      {t("Benefit Year")}
                    </p>
                    {showEditProfile ? (
                      <select
                        className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                        value={benefityear}
                        onChange={(e) => setBenefityear(e.target.value)}
                      >
                        <option value="jan-dec">Jan-Dec</option>
                        <option value="365+1 days">365+1 days</option>
                      </select>
                    ) : (
                      <p className="font-medium">{benefityear}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[55%]">
            <MedicalHistory id={id} />
          </div>
        </div>

        <div className="right space-y-4">
          <div className="pb-12">
            <Examinations id={id} />
          </div>
          {dm2 === "Yes" ? <Labs id={id} /> : null}
        </div>
      </div>
    </div>
  );
};
