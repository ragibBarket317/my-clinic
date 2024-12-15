import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useStore } from "../Store";
import Field from "./common/Field";

const AdminInviteModal = ({ isOpen, onClose, onHandleInviteSuccess }) => {
  const [invitationSuccess, setInvitationSuccess] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const { auth } = useStore();
  const { t } = useTranslation();

  const userRole = auth?.data?.data?.data?.role;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  useEffect(() => {
    if (invitationSuccess || alreadyExists) {
      const timer = setTimeout(() => {
        setInvitationSuccess(false);
        setAlreadyExists(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [invitationSuccess, alreadyExists]);

  const submitForm = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/invite/admin`,
        formData,
        { withCredentials: true }
      );

      if (response?.data?.statusCode === 200) {
        onHandleInviteSuccess();
        toast.success("Invitation Successfully sent", {
          className: "toast-custom",
        });
        reset();
        onClose();
        setInvitationSuccess(true);
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status === 409) {
        setError("email", {
          type: "manual",
          message: "This email is already associated with a user",
        });
        setAlreadyExists(true);
      } else if (error.response.status === 500) {
        setError("email", {
          type: "manual",
          message:
            "There somthing wrong in the server. Please try again later.",
        });
      } else {
        console.error(error);
        setError("email", {
          type: "manual",
          message: "An error occurred while sending the invitation",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 lato text-[16px]">
          <div className="bg-white dark:bg-[--secondary] p-6 rounded-lg w-[500px] ">
            <h2 className="text-lg font-semibold mb-4">{t("Invite Admin")}</h2>
            <form onSubmit={handleSubmit(submitForm)}>
              <div className="mb-4">
                <Field label={t("Email")} htmlFor="email" error={errors.email}>
                  <input
                    {...register("email", {
                      required: "Email ID is Required",
                    })}
                    className={`auth-input w-full dark:bg-[--secondary] ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="sample@gmail.com"
                  />
                </Field>
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block font-semibold mb-1 ">
                  {t("Role")}:
                </label>
                <select
                  {...register("role", { required: "Role is Required" })}
                  className={`auth-input w-full dark:bg-[--secondary] ${
                    errors.role ? "border-red-500" : "border-gray-300"
                  }`}
                  name="role"
                  id="role"
                  defaultValue=""
                >
                  <option value="" disabled selected>
                    {t("Select Role")}
                  </option>
                  {userRole === "superadmin" && (
                    <option value="admin">Admin</option>
                  )}

                  <option value="provider">Provider</option>
                  <option value="editor">Editor</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-theme text-theme-text py-2 px-4 rounded-md font-bold transition-all hover:opacity-90"
                  onClick={onClose}
                >
                  {t("Cancel")}
                </button>

                {loading ? (
                  <button
                    type="button"
                    className="bg-theme text-theme-text py-2 px-4 flex justify-between items-center rounded-md font-bold transition-all hover:opacity-90"
                    disabled
                  >
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
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
                    <span className="font-bold text-[14px]">
                      {t("Processing")}...
                    </span>
                  </button>
                ) : (
                  <button className="bg-theme text-theme-text py-2 px-4 rounded-md font-bold transition-all hover:opacity-90">
                    {t("Send Invitation")}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminInviteModal;
