import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useStore } from "../../Store";

const notifyMeAboutOptions = [
  {
    label: "All new messages and notes",
    value: "all",
  },
  {
    label: "Only new messages",
    value: "message",
  },
  {
    label: "Only new notes",
    value: "note",
  },
  {
    label: "None",
    value: "none",
  },
];
const notificationSounds = [
  {
    label: "Default",
    path: "/Default.mp3",
  },
  {
    label: "CyanMessage",
    path: "/CyanMessage.ogg",
  },
  {
    label: "Alpha",
    path: "/Alpha.ogg",
  },
  {
    label: "Fluorine",
    path: "/Fluorine.ogg",
  },
  {
    label: "Harp",
    path: "/Harp.ogg",
  },
  {
    label: "Jump",
    path: "/Jump.ogg",
  },
  {
    label: "Lalande",
    path: "/Lalande.ogg",
  },
  {
    label: "Lapetus",
    path: "/Lapetus.ogg",
  },
  {
    label: "Leap",
    path: "/Leap.ogg",
  },
  {
    label: "Pebble",
    path: "/Pebble.ogg",
  },
];
const messageSounds = [
  {
    label: "Default",
    path: "/Default.mp3",
  },
  {
    label: "Altair",
    path: "/Altair.ogg",
  },
  {
    label: "Argon",
    path: "/Argon.ogg",
  },
  {
    label: "Ariel",
    path: "/Ariel.ogg",
  },
  {
    label: "Beep Once",
    path: "/Beep Once.ogg",
  },
  {
    label: "Calme",
    path: "/Calme.ogg",
  },
  {
    label: "Castor",
    path: "/Castor.ogg",
  },
  {
    label: "Contact",
    path: "/Contact.ogg",
  },
  {
    label: "Milky Way",
    path: "/Milky Way.ogg",
  },
  {
    label: "Transmitter",
    path: "/Transmitter.ogg",
  },
];

const NotificationSettings = () => {
  const { auth, setAuth } = useStore();
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    emailNotify: auth?.data?.data?.data?.emailNotify || false,
    delay: auth?.data?.data?.data?.emailNotifyDelay || "1h",
    notifyOn: auth?.data?.data?.data?.notifyOn || "all",
    notificationSound:
      auth?.data?.data?.data?.preferredNotesNotificationSound || "Default",
    messageSound:
      auth?.data?.data?.data?.preferredMessagesNotificationSound || "Default",
  });

  const handleNotificationSettingsChange = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/setting/notification`,
        settings,
        { withCredentials: true }
      );

      if (response?.status === 200) {
        toast.success(t("Notification settings updated"), {
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
      toast.error(t("Failed to update Notification settings"), {
        className: "toast-custom",
      });
    }
  };

  return (
    <div className="w-[837px] h-[596px] p-6 bg-white dark:bg-[--secondary] rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t("Notify me about...")}</h2>

      <div className="mb-4">
        {notifyMeAboutOptions.map((option) => (
          <label key={option.label} className="flex items-center mb-2">
            <input
              type="radio"
              name="notify"
              className="mr-2"
              checked={option.value === settings.notifyOn}
              onChange={() => {
                setSettings({
                  ...settings,
                  notifyOn: option.value,
                });
              }}
            />
            {t(option.label)}
          </label>
        ))}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">
          {t("Notification sound (messages)")}
        </label>

        <select
          onChange={(e) => {
            setSettings({
              ...settings,
              messageSound: e.target.value,
            });
            const audio = new Audio(
              `/notificationSounds/message${e.target.value}`
            );
            audio.play();
          }}
          className="w-full p-2 border rounded dark:bg-gray-800"
          value={settings.messageSound}
        >
          {messageSounds.map((sound) => (
            <option
              className="flex items-center justify-between"
              key={sound.path}
              value={sound.path}
            >
              <span>{sound.label}</span>
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">
          {t("Notification sound (Notes for the patients)")}
        </label>
        <select
          onChange={(e) => {
            setSettings({
              ...settings,
              notificationSound: e.target.value,
            });
            const audio = new Audio(
              `/notificationSounds/notification${e.target.value}`
            );
            audio.play();
          }}
          className="w-full p-2 border rounded dark:bg-gray-800"
          value={settings.notificationSound}
        >
          {notificationSounds.map((sound) => (
            <option key={sound.path} value={sound.path}>
              {sound.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            className="mr-2"
            checked={settings.emailNotify}
            onChange={() => {
              setSettings({
                ...settings,
                emailNotify: !settings.emailNotify,
              });
            }}
            // onClick={() => handleEmailNotifyToggle()}
          />
          {t("Send me email notifications for notes and direct messages")}
        </label>
        <div className="ml-6">
          <label className="flex items-center mb-2">
            <input
              type="radio"
              name="email-frequency"
              className="mr-2"
              checked={settings.delay === "Immediately"}
              onClick={() => {
                setSettings({
                  ...settings,
                  delay: "Immediately",
                });
              }}
              disabled={!settings.emailNotify}
            />
            {t("Immediately")}
          </label>
          <label className="flex items-center mb-2">
            <input
              type="radio"
              name="email-frequency"
              className="mr-2"
              checked={settings.delay === "15m"}
              onClick={() => {
                setSettings({
                  ...settings,
                  delay: "15m",
                });
              }}
              disabled={!settings.emailNotify}
            />
            {t("Once every 15 minutes")}
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="email-frequency"
              className="mr-2"
              checked={settings.delay === "1h"}
              onClick={() => {
                setSettings({
                  ...settings,
                  delay: "1h",
                });
              }}
              disabled={!settings.emailNotify}
            />
            {t("Once an hour")}
          </label>
        </div>
      </div>
      <div>
        <button
          onClick={handleNotificationSettingsChange}
          className="bg-theme text-theme-text hover:bg-theme-hover font-bold py-2 px-4 rounded"
        >
          {t("Update")}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
