import React from "react";

import { useTranslation } from "react-i18next";
import { useStore } from "../Store";

const EditMedicalHistory = () => {
  const {
    risk,
    setRisk,
    statins,
    setStatins,
    dm2,
    setDm2,
    tobaccoUse,
    setTobaccoUse,
    dexa,
    setDexa,
    gender,
    bmi,
    setBmi,
    chronicConditions,
    setChronicConditions,
  } = useStore();
  const { t } = useTranslation();

  return (
    <>
      <div className="infoBox  flex items-start space-x-[8%] text-[12px]">
        <div className="col1 space-y-4  text-[14px] leading-8">
          <div className="box1">
            <p className="text-gray-500 font-medium mb-1">{t("Risk")}</p>
            <div className="font-medium flex items-center">
              <select
                className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
              >
                <option value="" disabled selected>
                  Select
                </option>
                <option value="Low">{t("Low")}</option>
                <option value="High">{t("High")}</option>
              </select>
            </div>
          </div>
          <div className="box1 ">
            <p className="text-gray-500 font-medium mb-1">{t("Tobacco Use")}</p>
            <div className="font-medium">
              <select
                className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                value={tobaccoUse}
                onChange={(e) => setTobaccoUse(e.target.value)}
              >
                <option value="" disabled selected>
                  {t("Select")}
                </option>
                <option value="Yes">{t("Yes")}</option>
                <option value="No">{t("No")}</option>
              </select>
            </div>
          </div>
          <div className="box1 ">
            <p className="text-gray-500 font-medium mb-1">BMI</p>
            <div className="font-medium">
              <input
                className="border outline-none px-2 rounded dark:bg-[--secondary] w-[80px]"
                type="number"
                id="bmi"
                name="bmi"
                min="10"
                max="50"
                value={bmi}
                onChange={(e) => setBmi(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="col2 space-y-4   text-[14px] leading-8">
          <div className="box2">
            <p className="text-gray-500 font-medium mb-1">{t("Statins")}</p>
            <div className="font-medium">
              <select
                className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                value={statins}
                onChange={(e) => setStatins(e.target.value)}
              >
                <option value="" disabled selected>
                  {t("Select")}
                </option>
                <option value="Yes">{t("Yes")}</option>
                <option value="Non-Compliant">{t("Non-Compliant")}</option>
                <option value="Allergic">{t("Allergic")}</option>
                <option value="Not Applicable">{t("Not Applicable")}</option>
              </select>
            </div>
          </div>
          <div className="box2 ">
            {/* we had change dexa to memogram. so consider all dexa field as mammogram  */}
            <p className="text-gray-500 font-medium mb-1">Mammogram</p>
            <div className="font-medium">
              <select
                className="border outline-none py-1 px-2 rounded dark:bg-[--secondary] "
                value={dexa}
                onChange={(e) => setDexa(e.target.value)}
              >
                <option value="" disabled selected>
                  {t("Select")}
                </option>
                <option value="Required">{t("Required")}</option>
                <option value="Not Required">{t("Not Required")}</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col3 space-y-4   text-[14px] leading-8">
          <div className="box3">
            <p className="text-gray-500 font-medium mb-1">DM2</p>
            <div className="font-medium">
              <select
                className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                value={dm2}
                onChange={(e) => setDm2(e.target.value)}
              >
                <option value="" disabled selected>
                  {t("Select")}
                </option>
                <option value="Yes">{t("Yes")}</option>
                <option value="No">{t("No")}</option>
                <option value="PreDM2">PreDM2</option>
              </select>
            </div>
          </div>
          <div className="box3">
            <p className="text-gray-500 font-medium mb-1">Chronic Conditions</p>
            <div className="font-medium">
              <select
                className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                value={chronicConditions}
                onChange={(e) => setChronicConditions(e.target.value)}
              >
                <option value="" disabled selected>
                  Select
                </option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditMedicalHistory;
