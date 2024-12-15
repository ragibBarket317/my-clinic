import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useForm } from "react-hook-form";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "../Store";
import Field from "./common/Field";

const LoginForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitForm = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/admins/login`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        // const accessToken = response?.data?.data?.accessToken;
        // Cookies.set("accessToken", accessToken);
        setAuth(response);
        navigate("/");
        toast.success(t("Login successful"));
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (
        (error.response && error.response.status === 401) ||
        error.response.status === 404
      ) {
        toast.error(t("Invalid email or password"));
      } else {
        toast.error(t("Something went wrong. Please try again later."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="border-[#3F3F3F] pb-10 lg:pb-[60px] w-[558px] text-[20px]"
      onSubmit={handleSubmit(submitForm)}
    >
      <Field label={t("Email")} error={errors.email}>
        <input
          {...register("email", { required: "Email ID is Required" })}
          className={`auth-input w-[558px] h-[65px] rounded-[10px] text-[18px] px-[20px] ${
            errors.email ? "border-red-500" : "border-[#7C7C7C]"
          }`}
          type="email"
          name="email"
          id="email"
          placeholder="Enter your Email"
        />
      </Field>

      <Field label={t("Password")} error={errors.password}>
        <div className="relative">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Your password must be at least 6 characters",
              },
            })}
            className={`auth-input relative w-[558px] h-[65px] rounded-[10px] text-[18px] px-[20px] ${
              errors.password ? "border-red-500" : "border-[#7C7C7C]"
            }`}
            type={showPass ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Enter your Password"
          />
          <div className="absolute inset-y-0 right-0 flex items-center mr-2">
            <div>
              {!showPass ? (
                <IoEyeOutline onClick={() => setShowPass(!showPass)} />
              ) : (
                <FaRegEyeSlash onClick={() => setShowPass(!showPass)} />
              )}
            </div>
          </div>
        </div>
      </Field>

      <div className="text-right  my-5">
        <Link
          to="/reset"
          className=" text-[#2750FA] font-semibold cursor-pointer"
        >
          {t("Forgotten")}?
        </Link>
      </div>

      <Field>
        {loading ? (
          <button
            disabled
            className="auth-input bg-blue-600 font-bold text-[20px] text-white transition-all hover:opacity-90 flex justify-center items-center"
          >
            <svg
              className="animate-spin h-6 w-6 mr-3"
              viewBox="0 0 800 800"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="400"
                cy="400"
                fill="none"
                r="200"
                strokeWidth="80"
                stroke="#ffffff"
                strokeDasharray="1008 1400"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-bold text-[20px]">{t("Processing")}...</span>
          </button>
        ) : (
          <button className="auth-input bg-blue-600 font-bold text-[20px] text-white transition-all hover:opacity-90">
            {t("Login")}
          </button>
        )}
      </Field>
    </form>
  );
};

export default LoginForm;
