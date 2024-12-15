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
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useStore } from "../../Store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PatientsCircularChart = ({ circularChartData }) => {
  const { showDarkMode } = useStore();
  const { malePatients, femalePatients, totalPatients = 0 } = circularChartData;
  const notMale = totalPatients - malePatients;
  const notFemale = totalPatients - femalePatients;
  const { t } = useTranslation();

  const doughnutData = {
    labels: [totalPatients],
    plugins: {
      Tooltip: false,
    },
    datasets: [
      {
        data: [malePatients, notMale],
        backgroundColor: ["#254ff9", "#efefef"],
        borderRadius: 10,
      },
    ],
  };
  const doughnutData2 = {
    labels: [totalPatients],
    datasets: [
      {
        data: [femalePatients, notFemale],
        backgroundColor: ["#ff715b", "#efefef"],
        borderRadius: 10,
        color: "#fff",
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
        backgroundColor: "#7ed321",
        color: "#fff",

        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex];
        },
      },
      tooltip: {
        enabled: false, // Disable tooltip
      },
    },

    cutout: "80%",
  };

  const centerTextPlugin = {
    id: "centerTextPlugin",
    beforeDraw: function (chart) {
      const width = chart.width;
      const height = chart.height;
      const ctx = chart.ctx;
      const { data } = chart;

      ctx.restore();

      const fontSize = (height / 114).toFixed(2);
      ctx.font = fontSize + "em sans-serif";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillStyle = "#333";

      const text1 = "Total";
      const text2 = `${data.labels[0]}`;

      const text1Y = height / 2 - 10;
      const text2Y = height / 2 + 10;

      ctx.fillText(text1, width / 2, text1Y);
      ctx.fillText(text2, width / 2, text2Y);

      ctx.save();
    },
  };
  return (
    <>
      <div className="bg-white p-4 pb-8 rounded-[12px] shadow-sm dark:bg-[--secondary]">
        <h2 className="text-lg font-semibold">{t("Patients")}</h2>
        <div className="flex justify-between gap-10">
          <div className="mt-4 text-center flex flex-col justify-end">
            <div className="">
              <div className="flex items-center mr-4">
                <span className="inline-block w-3 h-3 bg-[#254ff9] rounded mr-2"></span>
                <span>
                  {t("Male")}: {malePatients}
                </span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-[#ff715b] rounded mr-2"></span>
                <span>
                  {t("Female")}: {femalePatients}
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="w-[155px] h-[155px]">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
            <div className="w-[118px] h-[118px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Doughnut
                data={doughnutData2}
                options={doughnutOptions}
                plugins={[centerTextPlugin]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientsCircularChart;
