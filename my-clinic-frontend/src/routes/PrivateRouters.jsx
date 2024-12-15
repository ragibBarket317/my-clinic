import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import App from "../App";
import { useStore } from "../Store";
import Loader from "../components/Loader";
import "../customToastifyStyles.css";

// import MessagePage from "../pages/MessagePage";
const PrivateRouters = () => {
  const { auth, isMessageOpen, theme, colorMode } = useStore();
  const { i18n } = useTranslation();

  // console.log(theme, colorMode);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust the delay as needed
  }, []);
  // Get Language Property
  useEffect(() => {
    if (auth?.data?.data?.data?.language) {
      i18n.changeLanguage(auth?.data?.data?.data?.language);
    }
  }, [i18n, auth?.data?.data?.data?.language]);
  // Get Color Property
  useEffect(() => {
    const root = document.documentElement;
    root.className = `theme-${auth?.data?.data?.data?.theme?.name.toLowerCase()}`;
  }, [auth, theme.name, colorMode]);

  // Get Light, Dark & System Mode Property
  useEffect(() => {
    if (auth?.data?.data?.data?.theme?.mode === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else if (auth?.data?.data?.data?.theme?.mode === "dark") {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, [auth, colorMode]);

  useEffect(() => {
    if (auth?.data?.data?.data?.theme?.mode === "system") {
      const systemColorMode = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(systemColorMode);

      const systemModeListener = (e) => {
        const systemColorMode = e.matches ? "dark" : "light";
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(systemColorMode);
      };

      const systemModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      systemModeMediaQuery.addEventListener("change", systemModeListener);

      return () => {
        systemModeMediaQuery.removeEventListener("change", systemModeListener);
      };
    }
  }, [auth]);

  if (loading) {
    return <Loader />; // You can replace this with a loading spinner component
  }
  return (
    <div>
      <>
        {auth?.data?.data?.data?.email ? (
          <>
            <App />
          </>
        ) : (
          <Navigate to="/login" />
        )}
      </>
    </div>
  );
};

export default PrivateRouters;
