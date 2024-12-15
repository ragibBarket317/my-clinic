/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../Store";

const MissedAppointmentDetails = ({
  missedAppointData,
  filteredData,
  setFilteredData,
}) => {
  const { clinic, setClinic } = useStore();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(() => {
    // Initialize with the current month and year
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const [filterByClinic, setFilterByClinic] = useState(missedAppointData);

  useEffect(() => {
    // Extract year and month from the selected date
    const [year, month] = selectedDate.split("-");
    const filtered = missedAppointData.filter((item) => {
      const itemDate = new Date(item.appointmentDueDate);
      return (
        itemDate.getFullYear() === parseInt(year, 10) &&
        itemDate.getMonth() === parseInt(month, 10) - 1
      );
    });

    setFilteredData(filtered);
  }, [selectedDate, missedAppointData]);

  useEffect(() => {
    if (clinic !== "") {
      const filteredByClinic = missedAppointData.filter(
        (item) => item.clinic === clinic
      );
      setFilterByClinic(filteredByClinic);
    }
  }, [clinic, missedAppointData]);

  return (
    <div>
      <div className="bg-white p-4 rounded-[12px] shadow-sm dark:bg-[--secondary]">
        <h2 className="text-lg font-semibold mb-2">
          {t("Missed Appointment")}
        </h2>
        <div className="flex gap-5">
          <p>Total</p>
          <p>{missedAppointData.length}</p>
        </div>

        <div className="flex justify-between items-center">
          <p>{filteredData.length}</p>
          <input
            type="month"
            className="mt-2 p-2 rounded bg-[#f9f9f9] outline-none w-[125px] dark:bg-slate-800"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center">
          <p>{filterByClinic.length}</p>
          <select
            className="mt-2 p-2 rounded bg-[#f9f9f9] outline-none dark:bg-slate-800"
            value={clinic}
            onChange={(e) => setClinic(e.target.value)}
          >
            <option value="" disabled>
              {t("Clinic")}
            </option>
            <option value="dm">DM</option>
            <option value="dew">Dew</option>
            <option value="ww">WW</option>
            <option value="rb">RB</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MissedAppointmentDetails;
