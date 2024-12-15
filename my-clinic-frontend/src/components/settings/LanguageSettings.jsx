import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import timezones from "../../../utils/timeZones";
import { useStore } from "../../Store";

const LanguageSettings = () => {
  const { t, i18n } = useTranslation();
  const { auth, setAuth } = useStore();

  const languages = [
    { name: "English (US)", code: "en" },
    { name: "Deutsch (Deutschland)", code: "de" },
    { name: "Español (España)", code: "es" },
    { name: "Español (Latinoamérica)", code: "esLatam" },
    { name: "Français (France)", code: "fr" },
    { name: "Italiano (Italia)", code: "it" },
    { name: "Português (Brasil)", code: "pt" },
  ];

  const [settings, setSettings] = useState({
    language: auth?.data?.data?.data?.language || "en",
    timezone: auth?.data?.data?.data?.timezone || "system",
  });
  const [autoTimeZone, setAutoTimeZone] = useState(
    auth?.data?.data?.data?.timezone === "system"
  );

  const handleLanguageChange = (e) => {
    const selectedLang = languages.find((lang) => lang.code === e.target.value);
    // console.log(selectedLang);
    if (selectedLang) {
      setSettings({
        ...settings,
        language: selectedLang.code,
      });
      i18n.changeLanguage(selectedLang.code);
    }
  };

  // useEffect(() => {
  //   if (settings.language) {
  //     i18n.changeLanguage(settings.language);
  //   }
  // }, [i18n, settings.language]);

  const handleLanguageAndTimezone = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/setting/time-lang`,
        {
          ...settings,
          timezone: autoTimeZone ? "system" : settings.timezone,
        },
        { withCredentials: true }
      );
      // console.log("🚀 ~ handleLanguageAndTimezone ~ response:", response);

      if (response?.status === 200) {
        toast.success(t("Language and timezone settings updated"), {
          className: "toast-custom",
        });
        let {
          emailNotify,
          emailNotifyDelay,
          language,
          notifyOn,
          preferredMessagesNotificationSound,
          preferredNotesNotificationSound,
          theme,
          timezone,
        } = response.data.data;
        let newAuth = {
          ...auth,
        };
        newAuth.data.data.data = {
          ...newAuth.data.data.data,
          emailNotify,
          emailNotifyDelay,
          language,
          notifyOn,
          preferredMessagesNotificationSound,
          preferredNotesNotificationSound,
          theme,
          timezone,
        };
        setAuth(newAuth);
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error(t("Failed to update language and timezone settings"), {
        className: "toast-custom",
      });
    }
  };

  return (
    <div className="w-[837px] h-[596px] p-6 bg-white dark:bg-[--secondary] rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t("Language")}</h2>
        <div className="relative">
          <select
            value={settings.language}
            onChange={handleLanguageChange}
            className="block w-full py-2 px-4 bg-gray-100 border border-gray-300 dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <p className="text-gray-600 mt-2">
          {t("Choose the Language you’d like to use.")}
        </p>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">{t("Time Zone")}</h2>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="autoTimeZone"
            checked={autoTimeZone}
            onChange={(e) => setAutoTimeZone(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded-full"
          />
          <label htmlFor="autoTimeZone" className="ml-2 text-gray-700">
            {t("Set Time Zone Automatically")}
          </label>
        </div>
        <div className="relative">
          <select
            value={settings.timezone}
            onChange={(e) =>
              setSettings({ ...settings, timezone: e.target.value })
            }
            disabled={autoTimeZone}
            className="block w-full py-2 px-4 bg-gray-100 border border-gray-300 dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="system">System Default</option>

            {timezones.map((zone, index) => (
              <option key={index} value={zone}>
                {zone}
              </option>
            ))}

            {/* Add more time zones as needed */}
          </select>
        </div>
        <p className="text-gray-600 mt-2">
          {t(
            "Select your time zone to send summary and notification emails, for times in Your Activity feeds, and for reminders."
          )}
        </p>
      </div>
      <div className="mt-8">
        <button
          onClick={handleLanguageAndTimezone}
          className="bg-theme text-theme-text hover:bg-theme-hover  font-bold py-2 px-4 rounded"
        >
          {t("Update")}
        </button>
      </div>
    </div>
  );
};

export default LanguageSettings;
