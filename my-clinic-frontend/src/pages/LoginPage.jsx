import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "../Store";
import LoginForm from "../components/LoginFrom";
const LoginPage = () => {
  const { auth, setAuth } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    if (auth?.data?.data?.data?.email) {
      navigate("/");
    }
  }, [auth]);

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col  justify-between bg-blue-800 w-[50%] h-full p-10 text-white shadow-xl rounded-r-2xl  uppercase font-bold zumme">
        <div className="text-[120px] leading-[132px] w-[374px] h-[216px] ">
          <h1>{t("Welcome")}</h1>
          <h1>{t("Always")} !</h1>
        </div>
        <div className="w-[283px] h-[70px]">
          <img className="w-full" src="myClinic.png" alt="" />
        </div>
      </div>

      <div className="bg-white w-[50%] h-full ps-10   shadow-xl flex justify-center items-center montserrat">
        <div className="bg-[#f9f9f9] px-20 rounded-l-2xl h-[100%] w-[100%] flex items-center justify-center">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-[74px] font-bold mb-2">{t("Login")}</h1>
              <p className="mb-4 text-[20px]">{t("Hi Welcome Back")}👋</p>
            </div>

            <div className="w-[95%] mx-auto mt-14">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
