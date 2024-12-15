import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AiOutlineAppstore,
  AiOutlineLogout,
  AiOutlineMessage,
} from "react-icons/ai";

import {
  FaRegCalendar,
  FaRegCalendarTimes,
  FaRegUser,
  FaUserFriends,
} from "react-icons/fa";
import { GrDocumentText } from "react-icons/gr";
// import {
//   IoMoonOutline,

//   IoSunnyOutline,
// } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineManageAccounts } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../Store";
import logo1 from "../asset/logo.png";
import logo2 from "../asset/myClinic.png";
// import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const Sidebar = () => {
  const {
    showDarkMode,
    setShowDarkMode,
    setAuth,
    auth,
    setIsMessageOpen,
    isMissedAppointModalOpen,
    setIsMissedAppointModalOpen,
    colorMode,
    setColorMode,
  } = useStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const setTheme = useStore((state) => state.setTheme);

  const isSystemTrue =
    window.matchMedia("(prefers-color-scheme: dark)").matches === true;
  const openModal = () => {
    setIsMissedAppointModalOpen(true);
  };

  const closeModal = () => {
    setIsMissedAppointModalOpen(false);
    navigate("/patients");
  };

  const userRole = auth?.data?.data?.data?.role;

  const handleLogout = async () => {
    await axios
      .post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/admins/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          // Cookies.remove("accessToken");
          setAuth(null);
          navigate("/");
          toast.success(`You have successfully logged out!`, {
            className: "toast-custom",
          });
        }
      });
  };
  const handleSettingsUpdate = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/setting/theme`,
        {
          name: auth?.data?.data?.data?.theme?.name || "Default",
          mode: !showDarkMode ? "dark" : "light",
        },
        { withCredentials: true }
      );

      if (response?.status === 200) {
        toast.success(t("Theme settings updated"), {
          className: "toast-custom",
        });
        let { theme } = response.data.data;
        let newAuth = {
          ...auth,
        };
        newAuth.data.data.data = {
          ...newAuth.data.data.data,
          theme,
        };
        setAuth(newAuth);
        setColorMode(!showDarkMode ? "dark" : "light");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(t("Failed to update theme settings"));
    }
  };

  return (
    <div className="w-[250px] h-screen px-8 py-4  flex flex-col text-sm overflow-hidden fixed bg-white dark:bg-[--background] dark:text-[--text]">
      <div className="logo mb-8 mt-6">
        {showDarkMode ||
        auth?.data?.data?.data?.theme?.mode === "dark" ||
        isSystemTrue ? (
          <img src={logo2} alt="" />
        ) : (
          <img src={logo1} alt="" />
        )}
      </div>
      <div className="links">
        <ul className="space-y-2">
          <li className="hover:scale-105 hover:text-theme-hover duration-300 cursor-pointer">
            <NavLink
              to="/overview"
              className={({ isActive }) =>
                isActive
                  ? "text-theme gap-x-3 py-2 flex items-center"
                  : "gap-x-3 py-2 flex items-center"
              }
            >
              <AiOutlineAppstore className="text-[20px]" />
              <span>{t("Overview")}</span>
            </NavLink>
          </li>
          {/* <li className="hover:scale-105 hover:text-theme-hover duration-300 cursor-pointer">
            <NavLink
              to="/appointment"
              className={({ isActive }) =>
                isActive
                  ? "text-theme gap-x-3 py-2 flex items-center"
                  : "gap-x-3 py-2 flex items-center"
              }
            >
              <FaRegCalendar className="text-[20px]" />
              <span>{t("Appointment")}</span>
            </NavLink>
          </li> */}
          <li className="hover:scale-105 hover:text-theme-hover duration-300 cursor-pointer">
            <NavLink
              to="/patients"
              className={({ isActive }) =>
                isActive
                  ? "text-theme gap-x-3 py-2 flex items-center"
                  : "gap-x-3 py-2 flex items-center"
              }
            >
              <FaUserFriends className="text-[20px]" />
              <span>{t("Patients")}</span>
            </NavLink>
          </li>
          <li className="hover:scale-105 hover:text-theme-hover duration-300 cursor-pointer">
            <NavLink
              to="/documents"
              className={({ isActive }) =>
                isActive
                  ? "text-theme gap-x-3 py-2 flex items-center"
                  : "gap-x-3 py-2 flex items-center"
              }
            >
              <GrDocumentText className="text-[20px]" />
              <span>{t("Documents")}</span>
            </NavLink>
          </li>
          <li className="hover:scale-105 hover:text-theme-hover duration-300 cursor-pointer">
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                isActive
                  ? "text-theme gap-x-3 py-2 flex items-center"
                  : "gap-x-3 py-2 flex items-center"
              }
            >
              <AiOutlineMessage className="text-[20px]" />
              <span>{t("Messages")}</span>
            </NavLink>
          </li>
          <li
            onClick={openModal}
            className="hover:scale-105 hover:text-theme-hover duration-300 cursor-pointer "
          >
            <NavLink
              to="/missedAppointment"
              className={({ isActive }) =>
                isActive
                  ? "text-theme gap-x-3 py-2 flex items-center"
                  : "gap-x-3 py-2 flex items-center"
              }
            >
              <FaRegCalendarTimes className="text-[20px]" />
              <span>{t("Missed Appointment")}</span>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="links2 mt-auto">
        <ul className="space-y-2">
          <li className="hover:scale-105 hover:text-theme-hover duration-300 cursor-pointer">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "text-theme gap-x-3 py-2 flex items-center"
                  : "gap-x-3 py-2 flex items-center"
              }
            >
              <FaRegUser className="text-[20px]" />
              <span>{t("Profile")}</span>
            </NavLink>
          </li>
          {(userRole === "superadmin" || userRole === "admin") && (
            <li className="hover:scale-105 hover:text-theme-hover duration-300 cursor-pointer">
              <NavLink
                to="/manageMembers"
                className={({ isActive }) =>
                  isActive
                    ? "text-theme gap-x-3 py-2 flex items-center"
                    : "gap-x-3 py-2 flex items-center"
                }
              >
                <MdOutlineManageAccounts className="text-[24px]" />
                <span>{t("Manage Members")}</span>
              </NavLink>
            </li>
          )}

          <li className="hover:scale-105 hover:text-theme-hover duration-300 cursor-pointer">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive
                  ? "text-theme gap-x-3 py-2 flex items-center"
                  : "gap-x-3 py-2 flex items-center"
              }
            >
              <IoSettingsOutline className="text-[20px]" />
              <span>{t("Settings")}</span>
            </NavLink>
          </li>
          {/* <li className="hover:scale-105 hover:text-theme-hover duration-300 cursor-pointer">
            <button
              onClick={() => {
                setShowDarkMode(!showDarkMode);
                handleSettingsUpdate();
              }}
              className="gap-x-3 py-2 flex items-center"
            >
              {showDarkMode ? (
                <>
                  <IoSunnyOutline className="text-[20px]" />
                  <span>{t("Light Mode")}</span>
                </>
              ) : (
                <>
                  <IoMoonOutline className="text-[20px]" />
                  <span>{t("Dark Mode")}</span>
                </>
              )}
            </button>
          </li> */}
          <hr />
          <li className="mt-4 hover:scale-105 hover:text-theme-hover duration-300 cursor-pointer">
            <button
              onClick={() => {
                handleLogout();
              }}
              className="gap-x-3 py-2 flex items-center"
            >
              <AiOutlineLogout className="text-[20px]" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
      {/* <div className="container mx-auto p-4">
        <PatientAppointDetailsModal
          isOpen={isMissedAppointModalOpen}
          onClose={closeModal}
        />
      </div> */}
    </div>
  );
};
