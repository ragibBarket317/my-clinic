import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useStore } from "../Store";
import Field from "./common/Field";

const AdminInvite = () => {
  const [invitationSuccess, setInvitationSuccess] = useState(false);
  const { t } = useTranslation();
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const { auth } = useStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();
  useEffect(() => {
    if (invitationSuccess) {
      setTimeout(() => {
        setInvitationSuccess(false);
      }, 5000);
    }
    if (alreadyExists) {
      setTimeout(() => {
        setAlreadyExists(false);
      }, 5000);
    }
  }, [invitationSuccess, alreadyExists]);

  const submitForm = async (formData) => {
    try {
      setLoading(true);
      // // console.log(formData, "lol");
      if (
        !auth ||
        !auth.data ||
        !auth.data.data ||
        !auth.data.data.role === "superadmin"
      ) {
        throw new Error("Unauthorized");
      }
      const accessToken = Cookies.get("accessToken");
      // Set the access token in the request headers
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/invite/admin`,
        formData,
        config
      );

      if (response?.data?.statusCode === 200) {
        setInvitationSuccess(true);
        reset();
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status === 409) {
        setError("email", {
          type: "manual",
          message: "This email is already associated with a user",
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
      <div className="h-[100vh] lato">
        <div className="examinations space-y-6 bg-white dark:bg-[--secondary] shadow-xl px-8 py-6 rounded-lg text-[12px]">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-lg text-slate-900 dark:text-[--text]">
                  {t("Invite Admin")}
                </span>
              </div>
            </div>
            <div className="my-8">
              {auth?.data?.data?.data?.role === "superadmin" && (
                <form
                  className="border-[#3F3F3F] pb-10 lg:pb-[60px] bg-slate-100 dark:bg-slate-800 p-10 rounded-lg"
                  onSubmit={handleSubmit(submitForm)}
                >
                  <div>
                    <div className="w-full">
                      <div className="flex items-center gap-14 text-[16px]">
                        <h1>Email:</h1>
                        <Field error={errors.email}>
                          <input
                            {...register("email", {
                              required: "Email ID is Required",
                            })}
                            className={`auth-input dark:bg-[--secondary] mt-5 w-[60vh] ${
                              errors.email
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                            type="email"
                            name="email"
                            id="email"
                            placeholder="sample@gmail.com"
                          />
                        </Field>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="flex items-center gap-14 text-[16px]">
                        <h1>Role: </h1>
                        <Field error={errors.role}>
                          <select
                            {...register("role", {
                              required: "Role is Required",
                            })}
                            className="auth-input py-[10px] dark:bg-[--secondary] mt-5 border-gray-200 w-[60vh] ms-2"
                            name="role"
                            id="role"
                            defaultValue=""
                          >
                            <option value="" disabled selected>
                              Select Role
                            </option>
                            <option value="admin">Admin</option>
                            <option value="provider">Provider</option>
                            <option value="editor">Editor</option>
                          </select>
                        </Field>
                      </div>
                    </div>
                  </div>
                  {alreadyExists && (
                    <p className="text-[14px] text-red-500 font-bold mb-2">
                      This email is already associated with a user
                    </p>
                  )}
                  <div>
                    {loading ? (
                      <button
                        type="button"
                        className="bg-blue-600 text-white flex justify-between items-center rounded-md p-2 mt-8"
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
                          Processing...
                        </span>
                      </button>
                    ) : (
                      <button className="rounded-md p-2 bg-blue-600 font-bold text-[14px] text-white transition-all hover:opacity-90 mt-8">
                        Send Invitation
                      </button>
                    )}
                  </div>
                  {invitationSuccess && (
                    <p className="text-[14px] font-bold my-8">
                      Invitation Successfully sent
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminInvite;
