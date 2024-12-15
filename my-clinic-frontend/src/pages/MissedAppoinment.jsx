import axios from "axios";
import React, { useEffect, useState } from "react";
import AptTypesOrServices from "../components/missedApt/AptTypesOrServices";
import OverdueApts from "../components/missedApt/OverdueApts";

const data = [
  { clinic: "Dew", hosp: 10, attestation: 5, eye: 6, foot: 10 },
  { clinic: "DM", hosp: 5, attestation: 5, eye: 5, foot: 5 },
  { clinic: "RB", hosp: 5, attestation: 5, eye: 5, foot: 5 },
  { clinic: "WW", hosp: 5, attestation: 5, eye: 5, foot: 5 },
];

export default function MissedAppoinment() {
  const [chartData, setChartData] = useState([]);
  const [missedAppointData, setMissedAppointData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [aptTypes, setAptTypes] = useState([]);
  const [overdeuApts, setOverdeuApts] = useState([]);

  // console.log("Types", aptTypes);

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
  useEffect(() => {
    const fetchAptTypes = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/apts/special-status-counts`,
          { withCredentials: true }
        );

        // console.log("AptTypes", response.data.data);

        if (response?.status === 200) {
          setAptTypes(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAptTypes();
  }, []);
  useEffect(() => {
    const fetchOverdueApt = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/apts/overdue-appointments-analytics`,
          { withCredentials: true }
        );

        // console.log("Overdue", response.data.data);

        if (response?.status === 200) {
          setOverdeuApts(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchOverdueApt();
  }, []);
  return (
    <div className="h-[110vh]">
      <div className="flex justify-between">
        <div className="w-[70%]">
          {/* <MissedAptList /> */}
          <OverdueApts data={overdeuApts} />
          <AptTypesOrServices data={aptTypes} />
        </div>
        <div className="w-[25%]">
          {/* <MissedAppointmentDetails
            missedAppointData={missedAppointData}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
          /> */}
        </div>
      </div>
    </div>
  );
}
