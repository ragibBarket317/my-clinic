import React from "react";
import { useStore } from "../Store";

const Loader = () => {
  const { showDarkMode, auth } = useStore();

  return (
    <div
      className={`flex items-center justify-center h-screen ${
        showDarkMode || auth?.data?.data?.data?.theme?.mode === "dark"
          ? "bg-gray-900"
          : "bg-white"
      }`}
    >
      <div className="text-white flex justify-between items-center rounded-md p-2 mt-8">
        <svg
          className="animate-spin h-[85px] w-[85px] mr-3"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="400"
            cy="400"
            fill="none"
            r="200"
            strokeWidth="60"
            stroke="#00308F"
            strokeDasharray="1008 1400"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default Loader;
