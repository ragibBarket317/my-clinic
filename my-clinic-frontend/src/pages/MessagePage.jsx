import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSave } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { useStore } from "../Store";
import Message from "../components/Message";
import { useSocket } from "../components/SocketContext";
// function formatDate(isoString) {
//   const date = new Date(isoString);

//   // Get components
//   const day = date.getDate();
//   const month = date.getMonth() + 1; // Months are zero-based
//   const year = date.getFullYear();
//   let hours = date.getHours();
//   const minutes = date.getMinutes();

//   // Format day and month with leading zeros if necessary
//   const formattedDay = day < 10 ? `0${day}` : day;
//   const formattedMonth = month < 10 ? `0${month}` : month;

//   // Determine AM/PM and format hours
//   const ampm = hours >= 12 ? "PM" : "AM";
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   const formattedHours = hours < 10 ? `0${hours}` : hours;

//   // Format minutes with leading zeros if necessary
//   const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

//   // Combine into a readable format
//   const formattedDate = `${formattedHours}:${formattedMinutes} ${ampm} , ${formattedMonth}/${formattedDay}/${year}`;

//   return formattedDate;
// }
function formatDate(isoString, timeZone) {
  const date = new Date(isoString);

  // Get components in the specified time zone
  const options = { timeZone, hour12: true };
  const formattedDateParts = date.toLocaleString("en-US", options).split(", ");
  const [monthDayYear, time] = formattedDateParts;

  // Split month, day, and year
  const [month, day, year] = monthDayYear.split("/");

  // Split hours, minutes, and AM/PM
  const [formattedHoursMinutes, ampm] = time.split(" ");

  // Combine into a readable format
  const formattedDate = `${formattedHoursMinutes} ${ampm} , ${month}/${day}/${year}`;

  return formattedDate;
}
const messagess = [
  {
    id: 1,
    sender: {
      name: "John Doe",
      image: "/avatar.jpg",
    },
    content: "Hey there! How are you?",
    timestamp: "2024-05-12T10:30:00",
  },
  {
    id: 2,
    sender: {
      name: "Jane Smith",
      image: "/avatar.jpg",
    },
    content: "I am doing well, thank you! How about you?",
    timestamp: "2024-05-12T10:32:00",
  },
];

function MessagePage() {
  const { t } = useTranslation();
  const {
    conversations = [],
    onlineUsers,
    selectedConversation,
    setSelectedConversation,
    messages,
    sendMessage,
    searchConvo,
    setSearchConvo,
    filteredConversations,
    updateMessage,
    getConversations,
    getMessages,
  } = useSocket() || {};
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState("");

  const { auth, showDarkMode } = useStore();
  function getTimeZone() {
    return auth?.data?.data?.data?.timezone === "system"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : auth?.data?.data?.data?.timezone;
  }
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (isEditing) {
      messageInputRef?.current?.focus();
    }
  }, [isEditing]);
  useEffect(() => {
    setMessage("");
    setIsEditing("");
  }, [selectedConversation]);
  return (
    <div className="flex h-[calc(100vh-100px)] overflow-y-hidden">
      {/* Sidebar */}
      <div className="w-1/4 pr-4 border-r border-gray-300">
        {/* <button
          onClick={handleNavigate}
          className="px-4 py-2 bg-blue-600 text-white rounded-sm mt-2 ml-4"
        >
          Back to Dasboard
        </button> */}
        {/* Search Bar */}
        <div className="p-4 relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 rounded-md"
            value={searchConvo}
            onChange={(e) => setSearchConvo(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-0 h-full rounded-e-lg text-white md:right-6"
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
        </div>
        {/* User List */}
        <div className="#overflow-y-auto space-y-2">
          {/* Example User List */}

          {!searchConvo &&
            conversations?.map((conversation) => (
              <div
                onClick={() => {
                  setSelectedConversation({ ...conversation });
                }}
                key={conversation._id}
                className={`flex flex-nowrap items-center p-4 border-b border-gray-300 hover:text-theme-text hover:bg-theme-hover cursor-pointer rounded-md duration-300 ${
                  selectedConversation?._id === conversation._id
                    ? "bg-theme text-theme-text font-semibold"
                    : ""
                }`}
              >
                <img
                  src={conversation.avatar || "/avatar.jpg"}
                  alt="User"
                  className={`shrink-0 object-cover w-8 h-8 rounded-full mr-4 ${
                    onlineUsers.includes(conversation._id)
                      ? "ring-2 ring-green-500 ring-offset-2"
                      : ""
                  }`}
                />
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`${
                        conversation?.lastMessageSenderId !==
                          auth?.data?.data?.data?._id &&
                        Object.keys(conversation).includes("seen") &&
                        !conversation?.seen &&
                        "font-extrabold"
                      }`}
                    >
                      {conversation?.fullName}
                    </span>
                    {conversation?.lastMessageSenderId !==
                      auth?.data?.data?.data?._id &&
                      Object.keys(conversation).includes("seen") &&
                      !conversation?.seen && (
                        <span className="h-2 w-2 rounded-full bg-gray-900 dark:bg-white"></span>
                      )}
                  </div>
                  <p
                    className={`text-sm ${
                      conversation?.lastMessageSenderId !==
                        auth?.data?.data?.data?._id &&
                      !conversation?.seen &&
                      "font-extrabold"
                    } `}
                  >
                    {conversation?.lastMessageSenderId ===
                      auth?.data?.data?.data?._id && "You : "}

                    {conversation?.lastMessageText?.length > 20
                      ? conversation?.lastMessageText?.slice(0, 20) + "..."
                      : conversation?.lastMessageText}
                  </p>
                  <p
                    className={`text-xs #text-right ${
                      conversation?.lastMessageSenderId !==
                        auth?.data?.data?.data?._id &&
                      !conversation?.seen &&
                      "font-extrabold"
                    } `}
                  >
                    {Object.keys(conversation).includes("lastMessageTime") &&
                      formatDate(conversation?.lastMessageTime, getTimeZone())}
                  </p>
                </div>
              </div>
            ))}
          {searchConvo &&
            filteredConversations?.map((conversation) => (
              <div
                onClick={() => {
                  setSelectedConversation({ ...conversation });
                }}
                key={conversation._id}
                className={`flex flex-nowrap items-center p-4 border-b border-gray-300 hover:text-theme-text hover:bg-theme-hover cursor-pointer rounded-md duration-300 ${
                  selectedConversation?._id === conversation._id
                    ? "bg-theme text-theme-text font-semibold"
                    : ""
                }`}
              >
                <img
                  src={conversation.avatar || "/avatar.jpg"}
                  alt="User"
                  className={`shrink-0 object-cover w-8 h-8 rounded-full mr-4 ${
                    onlineUsers.includes(conversation._id)
                      ? "ring-2 ring-green-500 ring-offset-2"
                      : ""
                  }`}
                />
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`${
                        conversation?.lastMessageSenderId !==
                          auth?.data?.data?.data?._id &&
                        Object.keys(conversation).includes("seen") &&
                        !conversation?.seen &&
                        "font-extrabold"
                      }`}
                    >
                      {conversation?.fullName}
                    </span>
                    {conversation?.lastMessageSenderId !==
                      auth?.data?.data?.data?._id &&
                      Object.keys(conversation).includes("seen") &&
                      !conversation?.seen && (
                        <span className="h-2 w-2 rounded-full bg-gray-900 dark:bg-white"></span>
                      )}
                  </div>
                  <p
                    className={`text-sm ${
                      conversation?.lastMessageSenderId !==
                        auth?.data?.data?.data?._id &&
                      !conversation?.seen &&
                      "font-extrabold"
                    } `}
                  >
                    {conversation?.lastMessageSenderId ===
                      auth?.data?.data?.data?._id && "You : "}

                    {conversation?.lastMessageText?.length > 20
                      ? conversation?.lastMessageText?.slice(0, 20) + "..."
                      : conversation?.lastMessageText}
                  </p>
                  <p
                    className={`text-xs #text-right ${
                      conversation?.lastMessageSenderId !==
                        auth?.data?.data?.data?._id &&
                      !conversation?.seen &&
                      "font-extrabold"
                    } `}
                  >
                    {Object.keys(conversation).includes("lastMessageTime") &&
                      formatDate(conversation?.lastMessageTime, getTimeZone())}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* Chatting Section */}
      {selectedConversation ? (
        <div className="w-[70%] flex-1 bg-slate-100/50 dark:bg-[--secondary] pb-12">
          {/* Example Chat */}
          <div className="p-4 border-b border-gray-300">
            <div className="flex items-center mb-2">
              <img
                src={selectedConversation?.avatar || "/avatar.jpg"}
                alt="User"
                className={`object-cover w-8 h-8 rounded-full mr-4 ${
                  onlineUsers.includes(selectedConversation?._id)
                    ? "ring-2 ring-green-500 ring-offset-2"
                    : ""
                }`}
              />
              <div>
                <h3 className="font-semibold">
                  {selectedConversation?.fullName}
                </h3>
                {onlineUsers.includes(selectedConversation?._id) ? (
                  <p className="text-green-500">Online</p>
                ) : (
                  <p className="text-gray-500">Offline</p>
                )}
              </div>
            </div>
          </div>
          {/* Chat Messages */}
          <div className=" p-4 h-[calc(100%-150px)] w-full #overflow-x-hidden  space-y-4 overflow-y-scroll relative">
            {messages.map((message) => (
              <Message
                key={message._id}
                message={message}
                setMessage={setMessage}
                selectedConversation={selectedConversation}
                setIsEditing={setIsEditing}
              />
            ))}
            <div className=" mb-4 flex flex-col" ref={messagesEndRef}>
              {" "}
            </div>
          </div>

          <div className=" w-full h-[100px] flex items-center px-4">
            <textarea
              ref={messageInputRef}
              placeholder="Type your message..."
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300 resize-none h-[60px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                //                 if (e.key === "Enter" && e.shiftKey) {
                //                   setMessage((prev) => prev + "\n");
                // return
                //                 }
                if (e.key === "Enter" && !e.shiftKey) {
                  if (isEditing) {
                    updateMessage(isEditing, message);

                    setIsEditing("");
                  } else {
                    sendMessage(message);
                  }
                  setMessage("");
                  messageInputRef.current?.blur();
                }
              }}
            />
            {isEditing ? (
              <button
                disabled={!message}
                onClick={() => {
                  updateMessage(isEditing, message);
                  setMessage("");
                  setIsEditing("");
                }}
                className="#absolute #bottom-4 #right-4 px-4 py-2 flex items-center"
              >
                <FiSave />
              </button>
            ) : (
              <button
                disabled={!message}
                onClick={() => {
                  sendMessage(message);
                  setMessage("");
                }}
                className="#absolute #bottom-4 #right-4 px-4 py-2 flex items-center"
              >
                <IoSend />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <p className="text-center font-bold text-3xl ">
            {t("Hi")}, {auth?.data?.data?.data?.fullName} 👋
          </p>
          <p className="text-center text-xl mt-4 text-slate-700 dark:text-slate-400">
            {t("Select a conversation from left sidebar to start chatting")}
          </p>
        </div>
      )}
    </div>
  );
}

export default MessagePage;
