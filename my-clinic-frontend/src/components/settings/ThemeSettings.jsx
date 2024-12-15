import axios from "axios";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { RiComputerLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useStore } from "../../Store";

const ThemeSettings = () => {
  const { t } = useTranslation();
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const { colorMode, setColorMode, auth, setAuth, setShowDarkMode } =
    useStore();

  const [settings, setSettings] = React.useState({
    name: auth?.data?.data?.data?.theme?.name || "Default",
    mode: auth?.data?.data?.data?.theme?.mode || "light",
  });

  const themes = [
    { name: "Default", color: "#254FF9" },
    { name: "Aubergine", color: "#4d1352" },
    { name: "Clementine", color: "#c64907" },
    { name: "Banana", color: "#ffe57b" },
    { name: "Jade", color: "#127a58" },
    { name: "Lagoon", color: "#0e5680" },
    { name: "Barbra", color: "#ffa1bf" },
    { name: "Gray", color: "#dddedf" },
    { name: "Indigo", color: "#122375" },
  ];

  const handleThemeChange = (newTheme) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      name: newTheme.name,
    }));
  };

  const handleModeChange = (mode) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      mode,
    }));
  };
  useEffect(() => {
    setSettings({
      name: auth?.data?.data?.data?.theme?.name || "Default",
      mode: auth?.data?.data?.data?.theme?.mode || "light",
    });
  }, [auth]);
  // useEffect(() => {
  //   if (settings.mode === "light") {
  //     document.documentElement.classList.remove("dark");
  //     document.documentElement.classList.add("light");
  //   } else if (settings.mode === "dark") {
  //     document.documentElement.classList.remove("light");
  //     document.documentElement.classList.add("dark");
  //   }
  // }, [settings.mode, colorMode]);

  // useEffect(() => {
  //   if (settings.mode === "system") {
  //     const systemColorMode = window.matchMedia("(prefers-color-scheme: dark)")
  //       .matches
  //       ? "dark"
  //       : "light";
  //     document.documentElement.classList.remove("light", "dark");
  //     document.documentElement.classList.add(systemColorMode);

  //     const systemModeListener = (e) => {
  //       const systemColorMode = e.matches ? "dark" : "light";
  //       document.documentElement.classList.remove("light", "dark");
  //       document.documentElement.classList.add(systemColorMode);
  //     };

  //     const systemModeMediaQuery = window.matchMedia(
  //       "(prefers-color-scheme: dark)"
  //     );
  //     systemModeMediaQuery.addEventListener("change", systemModeListener);

  //     return () => {
  //       systemModeMediaQuery.removeEventListener("change", systemModeListener);
  //     };
  //   }
  // }, [settings.mode]);

  const handleSettingsUpdate = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/setting/theme`,
        settings,
        { withCredentials: true }
      );

      if (response?.status === 200) {
        toast.success(t("Theme settings updated"), {
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
        setTheme(themes.find((t) => t.name === settings.name));
        setColorMode(newAuth?.data?.data?.data?.theme?.mode || "light");
        setShowDarkMode(newAuth?.data?.data?.data?.theme?.mode === "dark");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(t("Failed to update theme settings"), {
        className: "toast-custom",
      });
    }
  };

  return (
    <div className="w-[837px] h-[596px] p-6 bg-white dark:bg-[--secondary] rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t("Color Mode")}</h2>
        <p className="text-gray-600 mb-4">
          {t(
            "Choose if Appearance should be light or dark, or follow your computer’s settings."
          )}
        </p>
        <div className="flex space-x-2 w-[663px]">
          <button
            className={`w-[201px] h-[48px] py-2 px-4 rounded-md hover:border-2 hover:border-theme-hover ${
              settings.mode === "light"
                ? "bg-theme text-theme-text"
                : "bg-gray-100 dark:bg-gray-800 dark:text-white"
            } text-gray-800`}
            onClick={() => handleModeChange("light")}
          >
            <div className="flex justify-center items-center gap-2">
              <IoSunnyOutline className="text-[20px]" />
              <span>Light</span>
            </div>
          </button>
          <button
            className={`w-[201px] h-[48px] py-2 px-4 rounded-md hover:border-2 hover:border-theme-hover ${
              settings.mode === "dark"
                ? "bg-theme text-theme-text"
                : "bg-gray-100 dark:bg-gray-800 dark:text-white"
            } text-gray-800`}
            onClick={() => handleModeChange("dark")}
          >
            <div className="flex justify-center items-center gap-2">
              <IoMoonOutline className="text-[20px]" />
              <span>Dark</span>
            </div>
          </button>
          <button
            className={`w-[201px] h-[48px] py-2 px-4 rounded-md hover:border-2 hover:border-theme-hover ${
              settings.mode === "system"
                ? "bg-theme text-theme-text"
                : "bg-gray-100 dark:bg-gray-800 dark:text-white"
            } text-gray-800`}
            onClick={() => handleModeChange("system")}
          >
            <div className="flex justify-center items-center gap-2">
              <RiComputerLine className="text-[20px]" />
              <span>System</span>
            </div>
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">{t("Themes")}</h2>
        <div className="w-[651px] grid grid-cols-3 gap-4">
          {themes.map((themeItem) => (
            <button
              key={themeItem.name}
              onClick={() => handleThemeChange(themeItem)}
              className={`w-[201px] h-[76px] flex items-center rounded-[12px] border-2 hover:border-2 hover:border-theme-hover ${
                themeItem.name === settings.name
                  ? "border border-theme"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-[40%] pl-6">
                  <span
                    className="inline-block w-[44px] h-[44px] rounded-full"
                    style={{ backgroundColor: themeItem.color }}
                  ></span>
                </div>
                <div className="w-[60%] pl-2">{themeItem.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleSettingsUpdate}
        className="mt-4 bg-theme text-theme-text hover:bg-theme-hover py-2 px-4 rounded-md"
      >
        {t("Update")}
      </button>
    </div>
  );
};

export default ThemeSettings;
