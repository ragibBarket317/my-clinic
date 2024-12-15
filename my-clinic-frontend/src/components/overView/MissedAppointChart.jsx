import React, { useEffect, useState } from "react";
import MissedAppointDonutChart from "./MissedAppointDonutChart";
import { useTranslation } from "react-i18next";

const data = {
  all: { missed: 30, completed: 70 },
  male: { missed: 80, completed: 20 },
  female: { missed: 45, completed: 55 },
  clinics: {
    DM: { missed: 10, completed: 20 },
    Dew: { missed: 5, completed: 10 },
    WW: { missed: 8, completed: 15 },
    // RB: { missed: 7, completed: 15 },
  },
};

const MissedAppointChart = () => {
  const [gender, setGender] = useState("all");
  const [clinic, setClinic] = useState("");
  const [filteredData, setFilteredData] = useState(data.all);
  const { t } = useTranslation();

  const handleGenderChange = (event) => {
    setGender(event.target.value);
    setClinic(""); // Reset clinic filter when gender filter is changed
  };

  const handleClinicChange = (event) => {
    setClinic(event.target.value);
    setGender("all"); // Reset gender filter when clinic filter is changed
  };

  useEffect(() => {
    if (gender !== "all") {
      setFilteredData(data[gender]);
    } else if (clinic !== "") {
      setFilteredData(data.clinics[clinic]);
    } else {
      setFilteredData(data.all);
    }
  }, [gender, clinic]);

  return (
    <div className="bg-white p-4 rounded-[12px] shadow-sm dark:bg-[--secondary]">
      <h2 className="text-lg font-semibold mb-2">{t("Missed Appointment")}</h2>
      <main className="p-4">
        <div className="max-w-md mx-auto mb-4 flex justify-between items-center">
          <label htmlFor="gender" className="block text-gray-700 w-[70%]">
            {t("Select Gender")}:
          </label>
          <select
            id="gender"
            className="mt-1 block w-[30%] py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={gender}
            onChange={handleGenderChange}
          >
            <option value="all">All</option>
            <option value="male">{t("Male")}</option>
            <option value="female">{t("Female")}</option>
          </select>
        </div>
        <div className="max-w-md mx-auto mb-4 flex justify-between items-center">
          <label htmlFor="clinic" className="block text-gray-700 w-[70%]">
            {t("Select Clinic")}:
          </label>
          <select
            id="clinic"
            className="mt-1 block w-[30%] py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={clinic}
            onChange={handleClinicChange}
          >
            <option value="" disabled>
              Clinic
            </option>
            <option value="DM">DM</option>
            <option value="Dew">Dew</option>
            <option value="WW">WW</option>
            <option value="RB">RB</option>
          </select>
        </div>
        <div className="flex justify-center">
          {filteredData ? (
            <MissedAppointDonutChart data={filteredData} />
          ) : (
            <div className="text-center text-red-500">
              {t("No data available for the selected filters.")}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MissedAppointChart;
