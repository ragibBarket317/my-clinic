/* eslint-disable react/prop-types */
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

const PatientClinicBarChart = ({ chartData }) => {
  const { t } = useTranslation();
  const {
    patientsAge0To25OfClinics,
    patientsAge26To50OfClinics,
    patientsAge51To75OfClinics,
    patientsAge76To100OfClinics,
  } = chartData;
  const barData = {
    labels: ["0-25", "26-50", "51-75", "76-100"],
    datasets: [
      {
        label: "DM",
        data: [
          patientsAge0To25OfClinics?.dm,
          patientsAge26To50OfClinics?.dm,
          patientsAge51To75OfClinics?.dm,
          patientsAge76To100OfClinics?.dm,
        ],
        backgroundColor: "#ff715b",
      },
      {
        label: "DEW",
        data: [
          patientsAge0To25OfClinics?.dew,
          patientsAge26To50OfClinics?.dew,
          patientsAge51To75OfClinics?.dew,
          patientsAge76To100OfClinics?.dew,
        ],
        backgroundColor: "#254ff9",
      },
      {
        label: "WW",
        data: [
          patientsAge0To25OfClinics?.ww,
          patientsAge26To50OfClinics?.ww,
          patientsAge51To75OfClinics?.ww,
          patientsAge76To100OfClinics?.ww,
        ],
        backgroundColor: "#7ed321",
      },
      {
        label: "RB",
        data: [
          patientsAge0To25OfClinics?.rb,
          patientsAge26To50OfClinics?.rb,
          patientsAge51To75OfClinics?.rb,
          patientsAge76To100OfClinics?.rb,
        ],
        backgroundColor: "#fdc623",
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <div>
      <div className="bg-white p-4 rounded-[12px] shadow-sm dark:bg-[--secondary]">
        <h2 className="text-lg font-semibold mb-2">
          {t("Patients Based On The Clinic")}
        </h2>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default PatientClinicBarChart;
