import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import "chart.js/auto";
import React from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PatientBarChart = ({ barChartData }) => {
  const { t } = useTranslation();
  const {
    patientsAge0To25,
    patientsAge26To50,
    patientsAge51To75,
    patientsAge76To100,
    patientsAge100Plus,
  } = barChartData;

  const ageData = {
    labels: ["0-25", "26-50", "51-75", "76-100", "100+"],
    datasets: [
      {
        label: "Patients",
        data: [
          patientsAge0To25,
          patientsAge26To50,
          patientsAge51To75,
          patientsAge76To100,
          patientsAge100Plus,
        ],
        backgroundColor: "#7ed321",
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  const ageOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,

        font: {
          size: 18,
        },
        color: "#333",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "The Age of Patients",
          color: "#333",
        },
        grid: {
          drawBorder: false,
          display: false, // Hide y-axis grid lines
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          display: false, // Hide y-axis data labels
        },
        grid: {
          drawBorder: false,
          borderWidth: 10,
          display: true, // Hide y-axis grid lines
        },
      },
    },
  };
  return (
    <>
      <div>
        <div className="bg-white p-4 rounded-[12px] shadow-sm dark:bg-[--secondary]">
          <h2 className="text-lg font-semibold mb-2">{t("Patients")}</h2>
          <Bar data={ageData} options={ageOptions} />
        </div>
      </div>
    </>
  );
};

export default PatientBarChart;
