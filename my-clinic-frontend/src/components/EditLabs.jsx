import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../Store";

export const EditLabs = () => {
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
    setQTR1,
    setQTR2,
    setQTR3,
    setQTR4,
    setQTR1Date,
    setQTR2Date,
    setQTR3Date,
    setQTR4Date,
    setEGRFDate,
    setUACRDate,
  } = useStore();
  const { t } = useTranslation();

  return (
    <div className="">
      <div className="awe w-full space-y-2">
        <h3 className="bg-[#2062B1] text-white px-3 text-sm ">A1C</h3>
        <div className="flex items-center justify-between py-2 leading-8 text-[14px]">
          <div>
            <p>
              QTR1:{" "}
              <input
                className="custom-input dark:bg-[--secondary]"
                type="number"
                min="4"
                max="14"
                value={QTR1 === -1 ? null : QTR1}
                onChange={(e) => setQTR1(parseFloat(e.target.value).toFixed(1))}
              />
            </p>
            <p>
              {t("Date")} :
              <input
                className="dark:bg-[--secondary]"
                onChange={(e) => {
                  if (e.target.value) {
                    setQTR1Date(e.target.value);
                  } else {
                    setQTR1Date(""); // Reset the date to empty string if invalid
                  }
                }}
                value={QTR1Date}
                type="date"
                name=""
                id=""
              />
            </p>
          </div>
          <div>
            <p>
              QTR2 :{" "}
              <input
                className="custom-input dark:bg-[--secondary]"
                type="number"
                min="4"
                max="14"
                value={QTR2 === -1 ? null : QTR2}
                onChange={(e) => setQTR2(parseFloat(e.target.value).toFixed(1))}
              />
            </p>
            <p>
              {t("Date")} :{" "}
              <input
                className="dark:bg-[--secondary]"
                onChange={(e) => {
                  if (e.target.value) {
                    setQTR2Date(e.target.value);
                  } else {
                    setQTR2Date(""); // Reset the date to empty string if invalid
                  }
                }}
                value={QTR2Date}
                type="date"
                name=""
                id=""
              />
            </p>
          </div>
          <div>
            <p>
              QTR3 :{" "}
              <input
                className="custom-input dark:bg-[--secondary]"
                type="number"
                min="4"
                max="14"
                value={QTR3 === -1 ? null : QTR3}
                onChange={(e) => setQTR3(parseFloat(e.target.value).toFixed(1))}
              />
            </p>
            <p>
              {t("Date")} :{" "}
              <input
                className="dark:bg-[--secondary]"
                onChange={(e) => {
                  if (e.target.value) {
                    setQTR3Date(e.target.value);
                  } else {
                    setQTR3Date(""); // Reset the date to empty string if invalid
                  }
                }}
                value={QTR3Date}
                type="date"
                name=""
                id=""
              />
            </p>
          </div>
          <div>
            <p>
              QTR4 :{" "}
              <input
                className="custom-input dark:bg-[--secondary]"
                min="4"
                max="14"
                type="number"
                value={QTR4 === -1 ? null : QTR4}
                onChange={(e) => setQTR4(parseFloat(e.target.value).toFixed(1))}
              />
            </p>
            <p>
              {t("Date")} :{" "}
              <input
                className="dark:bg-[--secondary]"
                onChange={(e) => {
                  if (e.target.value) {
                    setQTR4Date(e.target.value);
                  } else {
                    setQTR4Date(""); // Reset the date to empty string if invalid
                  }
                }}
                value={QTR4Date}
                type="date"
                name=""
                id=""
              />
            </p>
          </div>
        </div>
        <h3 className="mt-2 bg-[#2062B1] text-white px-2 text-sm ">KED</h3>
        <div className="flex items-center justify-between py-2 leading-8 text-[14px]">
          <div>
            <p>
              CMP (eGFR) Date :{" "}
              <input
                className="dark:bg-[--secondary]"
                onChange={(e) => {
                  if (e.target.value) {
                    setEGRFDate(e.target.value);
                  } else {
                    setEGRFDate(""); // Reset the date to empty string if invalid
                  }
                }}
                value={eGRFDate}
                type="date"
                name=""
                id=""
              />
            </p>
          </div>
          <div>
            <p>
              ALBUMIN/CREATINE (uACR) Date :{" "}
              <input
                className="dark:bg-[--secondary]"
                onChange={(e) => {
                  if (e.target.value) {
                    setUACRDate(e.target.value);
                  } else {
                    setUACRDate(""); // Reset the date to empty string if invalid
                  }
                }}
                value={uACRDate}
                type="date"
                name=""
                id=""
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
