import axios from "axios";
import React from "react";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiEdit3 } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "../Store";
import { CustomFlag } from "./CustomFlag";
import { EditLabs } from "./EditLabs";

export function formatDateV2(inputDate) {
  // Split the input date into year, month, and day
  // Check if inputDate is null or not a string
  if (inputDate === null || typeof inputDate !== "string") {
    return ""; // Or any default value you prefer
  }

  // Split the input date into year, month, and day
  const [year, month, day] = inputDate.split("-");

  // Format the date as mm/dd/yyyy
  const formattedDate = `${month}/${day}/${year}`;

  return formattedDate;
}

export const Labs = () => {
  const {
    QTR1,
    QTR1Date,
    QTR2,

    QTR2Date,

    QTR3,

    QTR3Date,

    QTR4,

    QTR4Date,

    eGRFDate,

    uACRDate,

    auth,
    showLabs,
    setShowLabs,
  } = useStore();

  const { id } = useParams();
  const { t } = useTranslation();

  // console.log(QTR1);

  const formatDateDB = (dateString) => {
    // Regular expression to match the "dd-mm-yyyy" format
    const dateFormatRegex = /^(\d{2})-(\d{2})-(\d{4})$/;

    // Check if the date string matches the "dd-mm-yyyy" format
    if (dateFormatRegex.test(dateString)) {
      // Extract day, month, and year components
      const [, day, month, year] = dateString.match(dateFormatRegex);

      // Construct the formatted date string in "yyyy-mm-dd" format
      return `${year}-${month}-${day}`;
    } else {
      // If the date string does not match the expected format, return it unchanged
      return dateString;
    }
  };
  const userRole = auth?.data?.data?.data?.role;

  const handleSave = async () => {
    try {
      // Format dates before sending
      const formattedQTR1Date = QTR1Date;
      const formattedQTR2Date = QTR2Date;
      const formattedQTR3Date = QTR3Date;
      const formattedQTR4Date = QTR4Date;
      const formattedEGRFDate = eGRFDate;
      const formattedUACRDate = uACRDate;
      // Check if the user has existing lab data
      const labCheckResponse = await axios.get(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/patient/check-labs/${id}`,
        { withCredentials: true }
      );
      const hasLabData = labCheckResponse.data.data.exists || false;

      // console.log(labCheckResponse);

      if (!hasLabData) {
        // Make a POST request if user don't have labs
        const postResponse = await axios.post(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/patient/add-labs/${id}`,
          {
            QTR1,
            QTR1Date: formattedQTR1Date,
            QTR2,
            QTR2Date: formattedQTR2Date,
            QTR3,
            QTR3Date: formattedQTR3Date,
            QTR4,
            QTR4Date: formattedQTR4Date,
            eGRFDate: formattedEGRFDate,
            uACRDate: formattedUACRDate,
          },
          { withCredentials: true }
        );

        if (postResponse?.status === 201) {
          // Redirect to the same page with a success message query parameter
          // window.location.href = `${window.location.origin}${window.location.pathname}?success=Labs data created successfully!`;
          toast.success(t("Labs data created successfully!"), {
            className: "toast-custom",
          });
        }
      } else {
        // Make a PATCH request if all fields are filled
        const patchResponse = await axios.patch(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/patient/update-labs-data/${id}`,
          {
            QTR1: QTR1 || -1,
            QTR1Date: formattedQTR1Date,
            QTR2: QTR2 || -1,
            QTR2Date: formattedQTR2Date,
            QTR3: QTR3 || -1,
            QTR3Date: formattedQTR3Date,
            QTR4: QTR4 || -1,
            QTR4Date: formattedQTR4Date,
            eGRFDate: formattedEGRFDate,
            uACRDate: formattedUACRDate,
          },
          { withCredentials: true }
        );

        if (patchResponse?.status === 200) {
          // window.location.href = `${window.location.origin}${window.location.pathname}?success=Medical history updated successfully!`;
          toast.success(t("Labs data updated successfully!"), {
            className: "toast-custom",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(t("Something went wrong"), {
        className: "toast-custom",
      });
      // Handle error if needed
    }
  };

  return (
    <div className="Labs space-y-6 bg-white dark:bg-[--secondary] shadow-lg px-8 py-6 rounded-lg text-[12px]">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg text-slate-900 dark:text-[--text]">
          {t("Labs")}
        </span>
        <span className="hover:scale-105 hover:text-theme duration-300 cursor-pointer text-[16px]">
          {(userRole === "superadmin" ||
            userRole === "editor" ||
            userRole === "admin") &&
            (showLabs ? (
              <FiCheckCircle
                onClick={() => {
                  setShowLabs(false);
                  handleSave();
                }}
                size={20}
              />
            ) : (
              <FiEdit3 onClick={() => setShowLabs(true)} size={20} />
            ))}
        </span>
      </div>
      {!showLabs ? (
        <div className="">
          <div className="awe w-full space-y-2">
            <h3 className="bg-theme text-theme-text px-2 text-sm ">A1C</h3>
            <div className="flex items-center justify-between py-2 leading-8 text-[14px]">
              <div>
                <p>QTR1 : {QTR1 === -1 ? "" : QTR1}</p>
                {QTR1 > 9 ? (
                  <CustomFlag
                    text="High"
                    bgcolor="bg-red-700"
                    bordercolor="bg-customRed"
                  />
                ) : null}

                {QTR1 < 2 ? (
                  <CustomFlag
                    text="Due"
                    bgcolor="bg-red-700"
                    bordercolor="bg-customRed"
                  />
                ) : (
                  <p>
                    {t("Date")} : {formatDateV2(QTR1Date)}
                  </p>
                )}
              </div>
              <div>
                <p>QTR2 : {QTR2 === -1 ? "" : QTR2}</p>
                {QTR2 > 9 ? (
                  <CustomFlag
                    text="High"
                    bgcolor="bg-red-700"
                    bordercolor="bg-customRed"
                  />
                ) : null}

                {QTR2 < 2 ? (
                  <CustomFlag
                    text="Due"
                    bgcolor="bg-red-700"
                    bordercolor="bg-customRed"
                  />
                ) : (
                  <p>
                    {t("Date")} : {formatDateV2(QTR2Date)}
                  </p>
                )}
              </div>
              <div>
                <p>QTR3 : {QTR3 === -1 ? "" : QTR3}</p>
                {QTR3 > 9 ? (
                  <CustomFlag
                    text="High"
                    bgcolor="bg-red-700"
                    bordercolor="bg-customRed"
                  />
                ) : null}

                {QTR3 < 2 ? (
                  <CustomFlag
                    text="Due"
                    bgcolor="bg-red-700"
                    bordercolor="bg-customRed"
                  />
                ) : (
                  <p>
                    {t("Date")} : {formatDateV2(QTR3Date)}
                  </p>
                )}
              </div>
              <div>
                <p>QTR4 : {QTR4 === -1 ? "" : QTR4}</p>
                {QTR4 > 9 ? (
                  <CustomFlag
                    text="High"
                    bgcolor="bg-red-700"
                    bordercolor="bg-customRed"
                  />
                ) : null}

                {QTR4 < 2 ? (
                  <CustomFlag
                    text="Due"
                    bgcolor="bg-red-700"
                    bordercolor="bg-customRed"
                  />
                ) : (
                  <p>
                    {t("Date")} : {formatDateV2(QTR4Date)}
                  </p>
                )}
              </div>
            </div>
            <h3 className="mt-2 bg-theme text-theme-text px-2 text-sm ">KED</h3>
            <div className="flex items-center justify-between py-2 leading-8 text-[14px]">
              <div>
                <p>
                  CMP (eGFR) Date :{" "}
                  {eGRFDate < 2 ? (
                    <CustomFlag
                      text="Due"
                      bgcolor="bg-red-700"
                      bordercolor="bg-customRed"
                    />
                  ) : (
                    formatDateV2(eGRFDate)
                  )}
                </p>
              </div>
              <div>
                <p>
                  ALBUMIN/CREATINE (uACR) Date :{" "}
                  {uACRDate < 2 ? (
                    <CustomFlag
                      text="Due"
                      bgcolor="bg-red-700"
                      bordercolor="bg-customRed"
                    />
                  ) : (
                    formatDateV2(uACRDate)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EditLabs showLabs={showLabs} />
      )}
    </div>
  );
};
