import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { useStore } from "../Store";
import { useSocket } from "./SocketContext";

// Helper function to format the date
function formatDate(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    // less than an hour
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    // less than a day
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
}

// Function to format date for chat app
// function chatDateFormatter(dateString) {
//   const date = new Date(dateString);
//   const now = new Date();

//   // Check if the date is today
//   const isToday = date.toDateString() === now.toDateString();
//   if (isToday) {
//     return `Today at ${date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     })}`;
//   }

//   // Check if the date is yesterday
//   const yesterday = new Date(now);
//   yesterday.setDate(now.getDate() - 1);
//   const isYesterday = date.toDateString() === yesterday.toDateString();
//   if (isYesterday) {
//     return `Yesterday at ${date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     })}`;
//   }

//   // For other dates, use a more generic format
//   return (
//     date.toLocaleDateString([], {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     }) +
//     ` at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
//   );
// }
function chatDateFormatter(dateString, timeZone) {
  const date = new Date(dateString);
  const now = new Date();

  // Check if the date is today
  const isToday =
    date.toLocaleDateString("en-US", { timeZone }) ===
    now.toLocaleDateString("en-US", { timeZone });
  if (isToday) {
    return `Today at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    })}`;
  }

  // Check if the date is yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.toLocaleDateString("en-US", { timeZone }) ===
    yesterday.toLocaleDateString("en-US", { timeZone });
  if (isYesterday) {
    return `Yesterday at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    })}`;
  }

  // For other dates, use a more generic format
  return (
    date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone,
    }) +
    ` at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    })}`
  );
}
const Dropdown = ({ message, setMessage, setShowDropdown, setIsEditing }) => {
  const { updateMessage, deleteMessage } = useSocket();
  return (
    <div className="absolute top-[0px] #left-[00px] ">
      <div className="relative inline-block text-left">
        <div
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-slate-800  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            <button
              onClick={() => {
                // setEdit(true);
                setIsEditing(message?._id);
                setMessage(message?.message);
                setShowDropdown(false);
              }}
              className="rounded-lg text-gray-700 dark:text-white block px-4 py-2 text-sm hover:bg-theme-hover hover:text-theme-text duration-100 w-full text-left"
            >
              Edit
            </button>
            <button
              onClick={() => {
                deleteMessage(message?._id);
                setIsEditing("");
                setMessage("");
                setShowDropdown(false);
              }}
              className="rounded-lg text-gray-700 dark:text-white block px-4 py-2 text-sm hover:bg-theme-hover hover:text-theme-text duration-100 w-full text-left"
              role="menuitem"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const Message = ({
  message,
  selectedConversation,
  setMessage,
  setIsEditing,
}) => {
  const [edit, setEdit] = useState(false);
  const [dot, setDot] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [msg, setMsg] = useState(message?.message);
  const { auth } = useStore();
  function getTimeZone() {
    return auth?.data?.data?.data?.timezone === "system"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : auth?.data?.data?.data?.timezone;
  }
  return (
    <div
      className={`relative w-fit max-w-[60%]  space-y-3 #max-w-fit mb-4 flex flex-col ${
        message?.senderId != selectedConversation?._id
          ? "#items-end"
          : "#items-start"
      } ${message?.senderId === auth?.data?.data?.data?._id && "ml-auto"}`}
      onMouseLeave={() => {
        if (showDropdown) setShowDropdown(false);
      }}
    >
      {showDropdown && (
        <Dropdown
          selectedConversation={selectedConversation}
          message={message}
          setMessage={setMessage}
          setShowDropdown={setShowDropdown}
          setIsEditing={setIsEditing}
        />
      )}

      {/* Message */}
      <div className="frow flex items-center justify-between gap-x-8">
        <div className="fcol flex items-center">
          <div className="img">
            {message?.senderId == selectedConversation?._id && (
              <img
                src={selectedConversation?.avatar || "/avatar.jpg"}
                // alt={message.sender.name}
                className="object-cover w-8 h-8 rounded-full mr-2 shrink-0"
              />
            )}
          </div>
          <div className="name">
            <h4 className="font-semibold">
              {message?.senderId === selectedConversation?._id
                ? selectedConversation?.fullName
                : ""}
            </h4>
          </div>
        </div>
        <div className="scol">
          {" "}
          <span className="text-gray-500 text-xs ">
            {chatDateFormatter(message?.createdAt, getTimeZone())}
          </span>
        </div>
      </div>
      <div
        onMouseOver={() => {
          setDot(true);
        }}
        onMouseLeave={() => {
          setDot(false);
        }}
        className="srow ml-10 relative %flex"
      >
        {message?.senderId === auth?.data?.data?.data?._id && (
          <span
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
            className={`absolute right-full cursor-pointer px-2 py-2 ${
              dot && message?.senderId === auth?.data?.data?.data?._id
                ? "opacity-1"
                : "opacity-0"
            }`}
          >
            <HiDotsVertical />
          </span>
        )}

        <pre
          style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
          className={`lato w-fit max-w-full ${
            message?.senderId !== selectedConversation?._id
              ? "#text-right bg-slate-300 dark:bg-slate-800 rounded-xl px-4 py-2 ml-auto "
              : "bg-theme text-theme-text rounded-xl px-4 py-2  "
          }`}
        >
          {message?.message}
        </pre>
      </div>
      {edit && (
        <div className="pb-8">
          <input
            value={msg}
            onChange={(e) => {
              setMsg(e.target.value);
            }}
            type="text"
          />
          <p className="flex items-center justify-end gap-4 mt-4">
            <button
              onClick={() => {
                updateMessage(message?._id, msg);
                setEdit(false);
              }}
              className="bg-sky-500 text-white rounded-md px-2 text-xs hover:scale-[1.05] duration-200"
            >
              Update
            </button>
            <button
              onClick={() => {
                deleteMessage(message?._id);
                setEdit(false);
              }}
              className="bg-red-500 text-white rounded-md px-2 text-xs hover:scale-[1.05] duration-200"
            >
              Delete
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Message;
