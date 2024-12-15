import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegBell } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { TiBrush } from "react-icons/ti";
import LanguageSettings from "../components/settings/LanguageSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import ThemeSettings from "../components/settings/ThemeSettings";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState(1);
  const { t } = useTranslation();

  return (
    <div className="h-[110vh]">
      <div className="container mx-auto">
        <div className="flex gap-3">
          <button
            className={`py-2 px-4 ${
              activeTab === 1
                ? "bg-theme text-theme-text rounded-[6px]  py-[8px] px-[12px]"
                : ""
            }`}
            onClick={() => setActiveTab(1)}
          >
            <div className="flex items-center gap-2">
              <FaRegBell className="text-[20px]" />
              <span>{t("Notifications")}</span>
            </div>
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 2
                ? "bg-theme text-theme-text rounded-[6px]  py-[8px] px-[12px]"
                : ""
            }`}
            onClick={() => setActiveTab(2)}
          >
            <div className="flex items-center gap-2">
              <TiBrush className="text-[20px]" />
              <span>{t("Themes")}</span>
            </div>
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 3
                ? "bg-theme text-theme-text rounded-[6px] py-[8px] px-[12px]"
                : ""
            }`}
            onClick={() => setActiveTab(3)}
          >
            <div className="flex items-center gap-2">
              <TbWorld className="text-[20px]" />
              <span>{t("Language and region")}</span>
            </div>
          </button>
        </div>
        <div className="p-4 mt-6">
          {activeTab === 1 && <NotificationSettings />}
          {activeTab === 2 && <ThemeSettings />}
          {activeTab === 3 && <LanguageSettings />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
