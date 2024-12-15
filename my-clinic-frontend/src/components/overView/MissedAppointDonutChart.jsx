import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

const MissedAppointDonutChart = ({ data }) => {
  // console.log("ChatData", data);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (data) {
      const labels = ["Missed Appointments", "Complete Appointments"];
      const datasets = [
        {
          data: [data.missed, data.completed],
          backgroundColor: ["#FF715B", "#0235FF"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB"],
        },
      ];

      setChartData({ labels, datasets });
    }
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            let label = tooltipItem.label || "";
            if (label) {
              label += ": ";
            }
            label += Math.round(tooltipItem.raw * 100) / 100;
            return label;
          },
        },
      },
    },
    cutout: "70%",
  };

  return (
    <div className="max-w-md mx-auto">
      {chartData.labels ? (
        <div className="w-[250px] h-[250px]">
          <Doughnut data={chartData} options={options} />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default MissedAppointDonutChart;
