import axios from "axios";
import React from "react";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiEdit3 } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "../Store";
import { CustomFlag } from "./CustomFlag";
import EditExaminations from "./EditExaminations";
export const Examinations = () => {
  // const [isNewRecord, setIsNewRecord] = useState(true);
  const { id } = useParams();
  const { t } = useTranslation();
  const {
    gender,

    patientsAge,

    aweStatus,

    aweDate,

    aweCbpSystolic,

    aweCbpdiastolic,

    awePhq2Score,

    awePhq2Date,

    awePhq9Level,

    awePhq9Score,

    awePhq9Date,

    colStatus,

    colDate,

    bcsDate,

    acceStatus,

    acceDate,

    acceCbpSystolic,

    acceCbpdiastolic,

    acceFallRisk,

    attestation,

    hosper,

    eyeStatus,

    eyeDate,

    eyeResults,

    footStatus,

    footDate,

    phqVersion,

    dm2,

    auth,
    showEditExaminations,
    setShowEditExaminations,
  } = useStore();

  const userRole = auth?.data?.data?.data?.role;
  // const [patientDataLog, setPatientData] = useState({});

  // const formatDate = (dateString) => {
  //   if (!dateString) {
  //     return "";
  //   }

  //   const dateOnly = dateString.split("T")[0];
  //   return dateOnly;
  // };

  function formatDateV2(inputDate) {
    // Split the input date into year, month, and day
    const [year, month, day] = inputDate.split("-");

    // Format the date as mm/dd/yyyy
    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
  }

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

  //function to handleSave
  const handleSave = async () => {
    try {
      // Create an object to hold all the data
      const requestData = {
        aweStatus,
        aweDate: formatDateDB(aweDate),
        aweCbpSystolic,
        aweCbpdiastolic,
        awePhq2Score,
        awePhq2Date: formatDateDB(awePhq2Date),
        awePhq9Level,
        awePhq9Score,
        awePhq9Date: formatDateDB(awePhq9Date),
        colStatus,
        colDate: formatDateDB(colDate),
        bcsDate: formatDateDB(bcsDate),
        acceStatus,
        acceDate: formatDateDB(acceDate),
        acceCbpSystolic,
        acceCbpdiastolic,
        acceFallRisk,
        attestation,
        hosper,
        eyeStatus,
        eyeDate: formatDateDB(eyeDate) || "",
        eyeResults,
        footStatus,
        footDate: formatDateDB(footDate) || "",
        phqVersion,
      };

      // console.log("eyeDate", eyeDate);

      const XmCheckResponse = await axios.get(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/patient/check-exams/${id}`,
        { withCredentials: true }
      );
      const hasExamData = XmCheckResponse.data.data.exists || false;
      // console.log("🔥 Has exams Data? ", hasExamData);
      if (!hasExamData) {
        // Make POST request if there is no exam data
        const postResponse = await axios.post(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/patient/add-exams/${id}`,
          requestData,
          { withCredentials: true }
        );

        if (postResponse?.status === 201) {
          // Redirect to the same page with a success message query parameter
          toast.success("Examinations data created successfully!", {
            className: "toast-custom",
          });
          // window.location.href = `${window.location.origin}${window.location.pathname}?success=Examinations data created successfully!`;
        }
      } else {
        //Make PATCH request if there is data
        const patchResponse = await axios.patch(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/patient/update-exams/${id}`,
          requestData,
          { withCredentials: true }
        );
        // console.log(patchResponse);
        if (patchResponse?.status === 200) {
          // Redirect to the same page with a success message query parameter
          toast.success("Examinations data updated successfully!", {
            className: "toast-custom",
          });
          // window.location.href = `${window.location.origin}${window.location.pathname}?success=Examinations data updated successfully!`;
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Something went wrong", {
        className: "toast-custom",
      });
    }
  };

  return (
    <div>
      <div className="examinations space-y-6 bg-white dark:bg-[--secondary] shadow-lg px-8 py-6 rounded-lg text-[12px]">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg text-slate-900 dark:text-[--text]">
            {t("Examinations")}
          </span>
          <span className="hover:scale-105 hover:text-theme duration-300 cursor-pointer text-[16px]">
            {userRole !== "provider" &&
              (showEditExaminations ? (
                <FiCheckCircle
                  onClick={() => {
                    setShowEditExaminations(false);
                    handleSave();
                  }}
                  size={20}
                />
              ) : (
                <FiEdit3
                  onClick={() => setShowEditExaminations(true)}
                  size={20}
                />
              ))}
          </span>
        </div>
        {showEditExaminations ? (
          <EditExaminations />
        ) : (
          <div className="flex items-start justify-start gap-4">
            <div className="awe w-[30%] space-y-2 text-[14px]">
              <h3 className="bg-theme text-theme-text px-2 text-sm mb-4">
                AWE
              </h3>
              <p>
                {t("Status")} : {aweStatus === "none" ? "" : aweStatus}
              </p>

              {aweDate && (
                <p>
                  {t("Date")} : {formatDateV2(aweDate)}
                </p>
              )}
              {aweStatus === "Scheduled" ? (
                <>
                  <p>
                    <span className="text-slate-900 dark:text-white rounded-md font-semibold text-[14px] underline underline-offset-2">
                      CBP
                    </span>
                  </p>
                  <p>
                    Systolic : {aweCbpSystolic === -1 ? "" : aweCbpSystolic}
                  </p>
                  <p>
                    Diastolic : {aweCbpdiastolic === -1 ? "" : aweCbpdiastolic}{" "}
                  </p>

                  {aweCbpSystolic <= 139 && aweCbpdiastolic <= 89 && (
                    <>
                      <br />
                      <CustomFlag
                        text="Normal"
                        bgcolor="bg-green-700"
                        bordercolor="bg-customBlack"
                      />
                      <br />
                    </>
                  )}
                  {aweCbpSystolic >= 139 && aweCbpdiastolic >= 89 && (
                    <>
                      <br />
                      <CustomFlag
                        text="Not Normal"
                        bgcolor="bg-red-700"
                        bordercolor="bg-customBlack"
                      />
                      <br />
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
              <p>
                <span className="text-slate-900 dark:text-white rounded-md font-semibold text-[14px] underline underline-offset-2">
                  PHQ {phqVersion}
                </span>
              </p>
              {phqVersion === "2" ? (
                <>
                  <p>
                    {t("Score")} : {awePhq2Score === -1 ? "" : awePhq2Score}
                  </p>

                  {awePhq2Date && (
                    <p>
                      {t("Date")} : {formatDateV2(awePhq2Date)}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p>
                    {t("Score")} : {awePhq9Score === -1 ? "" : awePhq9Score}
                  </p>
                  <p>
                    {t("Level")} : {awePhq9Level === "none" ? "" : awePhq9Level}
                  </p>
                  {awePhq9Date && <p>Date : {formatDateV2(awePhq9Date)}</p>}
                </>
              )}

              {aweStatus === "Scheduled" &&
                patientsAge >= 45 &&
                patientsAge <= 75 && (
                  <>
                    <p>
                      <span className="text-slate-900 rounded-md font-semibold text-[14px] underline underline-offset-2">
                        COL
                      </span>
                    </p>
                    <p>
                      {t("Status")} : {colStatus}
                    </p>
                    {colStatus != "Refused" && colDate.length > 2 ? (
                      <p>
                        {t("Date")} : {formatDateV2(colDate)}
                      </p>
                    ) : (
                      <></>
                    )}
                  </>
                )}

              {gender === "Female" &&
                aweStatus === "Scheduled" &&
                patientsAge >= 50 &&
                patientsAge <= 74 && (
                  <>
                    <p>
                      <span className="text-slate-900 rounded-md font-semibold text-[14px] underline underline-offset-2">
                        BCS
                      </span>
                    </p>
                    {bcsDate.length < 2 ? (
                      <>
                        <br />
                        <CustomFlag
                          text="MAMMOGRAM OVERDUE"
                          bgcolor="bg-red-700"
                          bordercolor="bg-customRed"
                        />
                      </>
                    ) : (
                      <p>
                        {t("Date")} : {formatDateV2(bcsDate)}
                      </p>
                    )}
                  </>
                )}
              <hr />
            </div>
            {(dm2 === "Yes" ||
              dm2 === "PreDM2" ||
              patientsAge >= 50 ||
              true) && (
              <div className="acce w-[30%]">
                <div className=" space-y-2 text-[14px]">
                  <h3 className="bg-theme text-theme-text px-2 text-sm mb-4">
                    ACCE
                  </h3>
                  <p>
                    {t("Status")} : {acceStatus === "none" ? "" : acceStatus}
                  </p>
                  <p>
                    {t("Date")} :{" "}
                    {(acceStatus === "Completed" ||
                      acceStatus === "Scheduled") &&
                    acceDate ? (
                      formatDateV2(acceDate)
                    ) : (
                      <></>
                    )}
                  </p>
                  <hr />
                  {acceStatus == "Scheduled" ? (
                    <>
                      <p>
                        <span className="text-slate-900 rounded-md font-semibold text-[14px] underline underline-offset-2">
                          CBP
                        </span>
                      </p>
                      <p>
                        Systolic :{" "}
                        {acceCbpSystolic === -1 ? "" : acceCbpSystolic}
                      </p>
                      <p>
                        Diastolic :{" "}
                        {acceCbpdiastolic === -1 ? "" : acceCbpdiastolic}
                      </p>
                      {/* <hr /> */}

                      {acceCbpSystolic <= 139 && acceCbpdiastolic <= 89 && (
                        <>
                          <br />
                          <CustomFlag
                            text="Normal"
                            bgcolor="bg-green-700"
                            bordercolor="bg-customBlack"
                          />
                          <br />
                        </>
                      )}
                      {acceCbpSystolic >= 139 && acceCbpdiastolic >= 89 && (
                        <>
                          <br />
                          <CustomFlag
                            text="Not Normal"
                            bgcolor="bg-red-700"
                            bordercolor="bg-customBlack"
                          />
                          <br />
                        </>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                  {patientsAge >= 65 && (
                    <>
                      <hr />
                      <p>Fall Risk : {acceFallRisk}</p>
                    </>
                  )}

                  {/* <p>Attestation : {attestation}</p>
                  <p>HOSP/ER FU : {hosper}</p>
                  <hr />
                  {hosper === "Required ASAP" && (
                    <CustomFlag
                      text="REQUIRED ASAP" //HOSP/ER FU
                      bgcolor="bg-red-700"
                      bordercolor="bg-customRed"
                    />
                  )} */}
                </div>
              </div>
            )}
            <div className="awe w-[30%] ">
              {dm2 === "Yes" && (
                <div className="space-y-2 text-[14px]">
                  <h3 className="bg-theme text-theme-text px-2 text-sm mb-4">
                    EYE
                  </h3>
                  <p>
                    {t("Status")} : {eyeStatus === "none" ? "" : eyeStatus}
                  </p>
                  <p>
                    {t("Date")} :{" "}
                    {(eyeStatus === "Scheduled" || eyeStatus === "Completed") &&
                    eyeDate ? (
                      formatDateV2(eyeDate)
                    ) : (
                      <></>
                    )}
                  </p>
                  <p>
                    {t("Results")} :{" "}
                    {eyeStatus === "Scheduled" && eyeResults !== "none"
                      ? eyeResults
                      : null}
                  </p>
                  <h3 className="bg-theme text-theme-text px-2 text-sm mb-4">
                    Foot
                  </h3>
                  <p>
                    {t("Status")} : {footStatus === "none" ? "" : footStatus}
                  </p>
                  <p>
                    {t("Date")} :{" "}
                    {(footStatus === "Scheduled" ||
                      footStatus === "Completed") &&
                    footDate ? (
                      formatDateV2(footDate)
                    ) : (
                      <></>
                    )}
                  </p>
                  <hr />
                </div>
              )}
              <div className="mt-10 space-y-4 text-[14px]">
                {" "}
                <p className="font-bold text-[15px]">
                  Attestation : {attestation === "none" ? "" : attestation}
                </p>
                <p className="font-bold text-[15px]">
                  HOSP/ER FU : {hosper === "none" ? "" : hosper}
                </p>
                {/* <hr className="my-4" /> */}
                <p className="my-4"></p>
                {hosper === "Required ASAP" && (
                  <CustomFlag
                    text="REQUIRED ASAP" //HOSP/ER FU
                    bgcolor="bg-red-700"
                    bordercolor="bg-customRed"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
