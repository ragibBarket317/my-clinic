import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { FaRegBell } from "react-icons/fa";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "./Store";
import LiveNotificationPopup from "./components/LiveNotificationPopup";
import { Sidebar } from "./components/Sidebar";
import { useSocket } from "./components/SocketContext";

function App() {
  const {
    showDarkMode,
    searchQuery,
    setSearchQuery,
    fullName,
    handleSearch,
    count,
    setCount,
    notification,
    setNotification,
    isMissedAppointModalOpen,
  } = useStore();
  const [openNotification, setOpenNotification] = useState(false);
  const popupRef = useRef(null);
  const [read, setRead] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(true);
  const location = useLocation(); // Use useLocation to get the current route
  const { auth } = useStore();
  const socketContext = useSocket();
  const socket = socketContext?.socket;
  const messageAlert = socketContext?.messageAlert;
  const setMessageAlert = socketContext?.setMessageAlert;
  const setSelectedConversation = socketContext?.setSelectedConversation;
  const unreadMsgCount = socketContext?.unreadCount;
  const getConversations = socketContext?.getConversations;

  useEffect(() => {
    // console.log(location.pathname, "location.pathname]");
    setSelectedConversation && setSelectedConversation(null);
    getConversations && getConversations();
  }, [location.pathname]);
  useEffect(() => {
    const getUnreadCount = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/notifications/get-unread-notifications`,
          { withCredentials: true }
        );

        if (response?.status === 200) {
          setCount(response?.data?.data?.unreadCount);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUnreadCount();
  }, [notification]);

  useEffect(() => {
    const getNotification = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/notifications/get-notifications`,
          { withCredentials: true }
        );
        // console.log("1", response);
        if (response?.status === 200) {
          setNotification(response?.data?.data?.notifications);
          setCount(response?.data?.data?.unreadCount);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getNotification();
  }, [read]);

  useEffect(() => {
    // const socket = io(`${import.meta.env.VITE_SERVER_BASE_SOCKET_URL}`);
    socket?.on("noteAdded", async (newNote) => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/notifications/get-notifications`,
          { withCredentials: true }
        );
        // console.log("2", response);
        if (response?.status === 200) {
          setNotification(response?.data?.data?.notifications);
          setCount(response?.data?.data?.unreadCount);
          // console.log("Auth", auth);
          try {
            if (
              auth?.data?.data?.data?.notifyOn == "none" ||
              auth?.data?.data?.data?.notifyOn == "message"
            ) {
              return;
            } else {
              const audio = new Audio(
                `/notificationSounds/notification${
                  auth?.data?.data?.data?.preferredNotesNotificationSound ||
                  "/Default.mp3"
                }`
              );
              audio.play();
            }
          } catch (err) {
            console.log(err);
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
    return () => {
      socket?.off("noteAdded");
    };
  }, [notification, auth]);

  useEffect(() => {
    socket?.on("noteResolved", async (newNote) => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/notifications/get-notifications`,
          { withCredentials: true }
        );
        // console.log("3", response);
        if (response?.status === 200) {
          setNotification(response?.data?.data?.notifications);
          setCount(response?.data?.data?.unreadCount);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }, [notification]);

  const handleOpenNotification = () => {
    setOpenNotification(!openNotification);
  };

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value); // Update search query as user types
  };

  const handleInput = () => {
    navigate("/patients");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery === "") {
      return toast.error("Search value is required.");
    }
    // if(searchQuery !== ""){

    // }
    handleSearch(searchQuery);
  };

  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  return (
    <div className={`h-full w-full ${showDarkMode ? "dark" : ""}`}>
      {/* <div className="container mx-auto p-4">
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Open Modal
        </button>
        <PatientAppointDetailsModal isOpen={isModalOpen} onClose={closeModal} />
      </div> */}
      <div className="lato flex  w-full ">
        <Sidebar />
        <div className="ml-[250px]   #main-section w-[calc(100%-250px)] #min-h-screen border-s-2  bg-slate-100/50 dark:bg-[--background] dark:text-[--text] px-4 py-6">
          <div className="head-Menu flex items-center justify-between py-4 w-full">
            {" "}
            <span
              className={`w-[50%] inline-block ${
                isMissedAppointModalOpen ? "" : "relative"
              }`}
            >
              <form onSubmit={handleSubmit}>
                <input
                  id="search"
                  onFocus={handleInput}
                  onChange={handleInputChange}
                  className=" px-3 py-2 outline-none border rounded-lg border-gray-200 w-full dark:bg-[--secondary]"
                  type="text"
                  placeholder="Search by Account Number or Patient Name or Date of Birth (mm-dd-yyyy)"
                />
                {!isMissedAppointModalOpen && (
                  <button
                    type="submit"
                    className="absolute right-2 top-0 h-full rounded-e-lg text-white md:right-4"
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
                )}
              </form>
            </span>
            <span>
              <ul className="flex items-center gap-x-4">
                <li
                  onClick={() => {
                    setMessageAlert && setMessageAlert(false);
                    setSelectedConversation && setSelectedConversation(null);
                  }}
                  className="hover:scale-105 hover:text-sky-600 duration-300 cursor-pointer relative "
                >
                  <Link
                    to="/messages"
                    className="gap-x-3 py-2 flex items-center bg-gray-200 p-2 rounded-full dark:bg-gray-800 hover:bg-theme-hover hover:text-theme-text"
                  >
                    <AiOutlineMessage className="text-[20px]" />
                  </Link>
                  {unreadMsgCount > 0 && (
                    <div className="absolute top-[-5px] right-[-15px] w-6 h-6  bg-red-500 rounded-full p-1 text-[12px] font-bold flex justify-center items-center text-white">
                      {unreadMsgCount}
                    </div>
                  )}
                </li>
                <li className={isMissedAppointModalOpen ? "" : "relative"}>
                  <button
                    onClick={() => setOpenNotification(!openNotification)}
                    href="#"
                    className="gap-x-3 py-2 flex items-center bg-gray-200 dark:bg-gray-800 p-2 rounded-full hover:bg-theme-hover hover:text-theme-text"
                    title="Notification"
                  >
                    <FaRegBell className="text-[20px]" />
                  </button>
                  {!isMissedAppointModalOpen && (
                    <div className="absolute top-[-5px] right-[-15px] w-6 h-6  bg-red-500 rounded-full p-1 text-[12px] font-bold flex justify-center items-center text-white">
                      {count}
                    </div>
                  )}

                  {openNotification && (
                    <LiveNotificationPopup
                      setRead={setRead}
                      read={read}
                      setOpenNotification={setOpenNotification}
                    />
                  )}
                </li>
              </ul>
            </span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
