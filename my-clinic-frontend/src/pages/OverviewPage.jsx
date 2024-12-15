import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PatientBarChart from "../components/overView/PatientBarChart";
import PatientClinicBarChart from "../components/overView/PatientClinicBarChart";
import PatientsCircularChart from "../components/overView/PatientsCircularChart";

const OverviewPage = () => {
  const [chartData, setChartData] = useState([]);
  const [missedAppointData, setMissedAppointData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/overview/get-metrics`,
          { withCredentials: true }
        );

        if (response?.status === 200) {
          // console.log("ResPonse", response.data.data);
          setChartData(response?.data?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchChartData();
  }, []);

  useEffect(() => {
    const fetchMissedAppointData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/patient/missed-apts`,
          { withCredentials: true }
        );

        // console.log("MissedApp", response.data.data.missedApts);

        if (response?.status === 200) {
          setMissedAppointData(response.data.data.missedApts);
          setFilteredData(response.data.data.missedApts);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMissedAppointData();
  }, []);

  return (
    <>
      <div className="h-[100vh]">
        <div className="flex p-6 gap-x-5 montserrat">
          <div className="flex flex-col w-[60%] gap-y-6">
            <div className="bg-theme text-theme-text p-4 rounded-[12px]">
              <h1 className="text-lg">{t("Total Patients")}</h1>
              <p className="text-[30px]">{chartData?.totalPatients}</p>
            </div>
            {/* <UpCommingAppointment /> */}
            <PatientClinicBarChart chartData={chartData} />
          </div>
          <div className="flex flex-col w-[35%] gap-y-6">
            {/* <MissedAppoint
            missedAppointData={missedAppointData}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
          /> */}
            {/* <MissedAppointChart /> */}
            <PatientBarChart barChartData={chartData} />
            <PatientsCircularChart circularChartData={chartData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewPage;
