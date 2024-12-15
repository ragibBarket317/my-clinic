import axios from "axios";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiCheckCircle,
  FiEdit3,
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDateV3 } from "../../utils/ultimateMegaFinalDateFormatter";
import { useStore } from "../Store";
import EditMedicalHistory from "./EditMedicalHistory";

const MedicalHistory = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const {
    risk,
    statins,
    tobaccoUse,
    dm2,
    dexa,
    auth,
    showMedicalHistory,
    setShowMedicalHistory,
    bmi,
    bmiDate,
    setBmiDate,
    chronicConditions,
  } = useStore();

  const userRole = auth?.data?.data?.data?.role;

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const successMessage = urlParams.get("success");
  //   if (successMessage) {
  //     toast.success(successMessage);
  //     // Clear the query parameter from the URL after displaying the toast
  //     window.history.replaceState({}, document.title, window.location.pathname);
  //   }
  // }, []);
  // handling the save
  const handleSave = async () => {
    const requestData = {
      risk,
      statins,
      tobaccoUse,
      dm2,
      dexa,
      bmi,
      chronicConditions,
    };

    // // Check if any of the fields are null or undefined
    // const hasEmptyFields = Object.values(requestData).some(
    //   (value) => value === null || value === undefined
    // );

    // if (hasEmptyFields) {
    //   // window.location.href = `${window.location.origin}${window.location.pathname}?error=Please fill all the field!`;
    //   toast.error("All fields are required in Medical History");
    //   return;
    // }

    try {
      // Check if the user has existing medical history data

      const historyCheckResponse = await axios.get(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/patient/check-medical-history/${id}`,
        { withCredentials: true }
      );
      const hasMedicalHistory = historyCheckResponse.data.data.exists || false;

      if (!hasMedicalHistory) {
        // If no existing medical history, make a POST request

        const postResponse = await axios.post(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/patient/add-medical-history/${id}`,
          requestData,
          { withCredentials: true }
        );

        if (postResponse?.status === 201) {
          setBmiDate(postResponse?.data?.data?.bmiDate);
          // Redirect to the same page with a success message query parameter
          // window.location.href = `${window.location.origin}${window.location.pathname}?success=Medical history created successfully!`;
          toast.success(t("Medical history created successfully!"), {
            className: "toast-custom",
          });
        }
      } else {
        // If existing medical history, make a PATCH request

        const patchResponse = await axios.patch(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/patient/update-medical-history/${id}`,
          requestData,
          { withCredentials: true }
        );

        if (patchResponse?.status === 200) {
          setBmiDate(patchResponse?.data?.data?.bmiDate);
          // window.location.href = `${window.location.origin}${window.location.pathname}?success=Medical history updated successfully!`;
          toast.success(t("Medical history updated successfully!"), {
            className: "toast-custom",
          });
        }
      }
    } catch (error) {
      console.error("Error saving medical history:", error);
      toast.error("Failed to update medical history.", {
        className: "toast-custom",
      });
    }
  };

  return (
    <div className="medical-history h-[380px] space-y-6 bg-white dark:bg-[--secondary] dark:text-[--text] shadow-lg px-8 py-6 rounded-lg ">
      <div className="flex items-center justify-between mb-6">
        <span className="font-semibold text-lg text-slate-900 dark:text-[--text]">
          {t("Medical History")}
        </span>
        <span className="hover:scale-105 hover:text-theme duration-300 cursor-pointer">
          {userRole !== "provider" &&
            (showMedicalHistory ? (
              <FiCheckCircle
                onClick={() => {
                  setShowMedicalHistory(false);
                  handleSave();
                }}
                size={20}
              />
            ) : (
              <FiEdit3 onClick={() => setShowMedicalHistory(true)} size={20} />
            ))}
        </span>
      </div>

      {showMedicalHistory ? (
        <>
          <EditMedicalHistory />
        </>
      ) : (
        <div className="infoBox  flex items-start space-x-[14%] text-[12px]">
          <div className="col1 space-y-8  text-[14px] leading-8">
            <div className="box1">
              <p className="text-gray-500 font-medium mb-1">{t("Risk")}</p>
              <p className="font-medium text-red-600 flex items-center">
                {risk === "High" && (
                  <span className="text-red-600 mr-1">
                    <FiArrowUpCircle />
                  </span>
                )}
                {risk === "Low" && (
                  <span className="text-sky-600 mr-1">
                    <FiArrowDownCircle />
                  </span>
                )}
                <span
                  className={risk === "High" ? "text-red-600" : "text-blue-600"}
                >
                  {risk}
                </span>
              </p>
            </div>
            <div className="box1 ">
              <p className="text-gray-500 font-medium mb-1">
                {t("Tobacco Use")}
              </p>
              <p className="font-medium">{tobaccoUse}</p>
            </div>
            <div className="box1 ">
              <p className="text-gray-500 font-medium mb-1">BMI</p>
              {bmi !== -1 && <p className="font-medium">{bmi}</p>}
            </div>
          </div>
          <div className="col2 space-y-8   text-[14px] leading-8">
            <div className="box2">
              <p className="text-gray-500 font-medium mb-1">{t("Statins")}</p>
              <p
                className={
                  statins === "Non-Compliant"
                    ? "text-red-600 font-medium"
                    : "font-medium"
                }
              >
                {statins}
              </p>
            </div>
            <div className="box2 ">
              {/* we had change dexa to memogram. so consider all dexa field as mammogram  */}
              <p className="text-gray-500 font-medium mb-1">{t("Mammogram")}</p>
              <p className="font-medium">{dexa}</p>
            </div>
            <div className="box2 ">
              {/* we had change dexa to memogram. so consider all dexa field as mammogram  */}
              <p className="text-gray-500 font-medium mb-1">
                {t("BMI Date Last Recorded")}
              </p>
              <p className="font-medium">{formatDateV3(bmiDate)}</p>
            </div>
          </div>
          <div className="col3 space-y-8   text-[14px] leading-8">
            <div className="box3">
              <p className="text-gray-500 font-medium mb-1">DM2</p>
              <p className="font-medium">{dm2}</p>
            </div>
            <div className="box3">
              <p className="text-gray-500 font-medium mb-1">
                {t("Chronic Condition")}
              </p>
              <p className="font-medium">{chronicConditions}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
