import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getTimeElapsed } from "../../utils/getTimeElapsed";
import { useStore } from "../Store";
import useClickOutside from "../hooks/useClickOutside";

const LiveNotificationPopup = ({ read, setRead, setOpenNotification }) => {
  const { notification, setNotification, setCount, showDarkMode } = useStore();
  const { t } = useTranslation();
  const popupRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotifications, setFilteredNotifications] =
    useState(notification);
  // const { id: paramId } = useParams(); // Get the id from the route params
  // const [patientId, setPatientId] = useState(paramId);

  // console.log("Notification", paramId);

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (patientId) {
  //     // Perform any actions needed when patientId changes
  //     navigate(`/patientDashboard/${patientId}`);
  //     window.location.href = `/patientDashboard/${patientId}`;
  //   }
  // }, [patientId, navigate]);

  useClickOutside(popupRef, () => setOpenNotification(false));

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredNotifications(notification);
    } else {
      setFilteredNotifications(
        notification.filter((notify) =>
          notify.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, notification]);

  // console.log("Notification from live notification", notification);

  const handleNavigate = async (id, notifyId, singalRead) => {
    // console.log("Read:", singalRead);
    try {
      if (singalRead === false) {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/notifications/mark-read-notification/${notifyId}`,
          { withCredentials: true }
        );
        // console.log("Handle Navigate:", response);
        if (response?.status === 200) {
          setRead(!read);
        }
      }

      // navigate(`/patientDashboard/${id}`);
      // setPatientId(id);
      window.location.href = `/patientDashboard/${id}`;
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkOnRead = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/notifications/mark-read-notifications`,
        { withCredentials: true }
      );

      if (response?.status === 200) {
        // console.log("Mark on read", response?.data?.data?.message);
        setRead(!read);
        toast.success(`${response?.data?.data?.message}`, {
          className: "toast-custom",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleInput = () => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  // console.log(patientId);

  return (
    <div className="relative">
      <div
        ref={popupRef}
        className="absolute z-20 top-[10px] right-0 mt-2 mr-2 w-[300px] py-2 px-2 bg-white dark:bg-[--secondary] border border-gray-300 rounded-md shadow-md"
      >
        <div>
          <div className="text-xl my-4 pl-4">{t("Notifications")}</div>

          <div className="relative pb-4 w-[80%] pl-4 ">
            <form onSubmit={handleSubmit}>
              <input
                id="search"
                onFocus={handleInput}
                onChange={handleInputChange}
                className=" px-3 py-2 outline-none border rounded-lg border-gray-200 w-full dark:bg-[--secondary]"
                type="text"
                placeholder="Search by Name"
              />

              <button
                type="submit"
                className="absolute right-2 top-[-6px] h-full rounded-e-lg text-white md:right-4"
              >
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke={showDarkMode ? "white" : "black"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </form>
          </div>

          <div className="overflow-y-auto h-96">
            {/* Content based on active tab */}

            <div className="px-4 pb-1">
              {filteredNotifications?.map((notify) => (
                <div
                  onClick={() =>
                    handleNavigate(notify.patientId, notify._id, notify.read)
                  }
                  key={notify._id}
                  className="py-2 border-b cursor-pointer"
                >
                  <h2
                    className={`${
                      !notify.read ? "font-semibold text-[16px]" : "text-[16px]"
                    }`}
                  >
                    {notify.content}
                  </h2>
                  <p
                    className={`${
                      !notify.read
                        ? "text-[12px] text-blue-600"
                        : "text-[12px] text-gray-600"
                    }`}
                  >
                    {getTimeElapsed(notify.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <button
              onClick={handleMarkOnRead}
              className="text-blue-600 px-4 py-2 w-full text-end"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveNotificationPopup;
