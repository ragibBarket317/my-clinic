import React, { useState } from "react";
import { useStore } from "../Store";

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);
  const { showDarkMode, setShowDarkMode } = useStore();

  const handleToggle = () => {
    setIsOn(!isOn);
    setShowDarkMode(!showDarkMode);
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-16 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
          isOn ? "bg-gray-100" : "bg-gray-300"
        }`}
        onClick={handleToggle}
      >
        <div
          className={` w-6 h-6 rounded-full shadow-md transform ${
            isOn ? "translate-x-6 bg-gray-600" : "bg-white"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
