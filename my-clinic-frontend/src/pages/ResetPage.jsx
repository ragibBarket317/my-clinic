import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useStore } from "../Store";
import Field from "../components/common/Field";

const ResetPage = () => {
  const [email, setEmail] = useState("");

  const [invitationSuccess, setInvitationSuccess] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const { auth } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.data?.data?.data?.email) {
      navigate("/");
    }
  }, [auth]);
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

  const handleSubmitBtn = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const accessToken = Cookies.get("accessToken");
      // Set the access token in the request headers
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/admins/reset-password-email`,
        { email },
        config,
        { withCredentials: true }
      );

      if (response?.data?.message === "The email doesn't exists.") {
        toast.error("The email doesn't exists.");
        return;
      }

      if (
        response?.data?.statusCode === 200 &&
        response?.data?.message === "Success"
      ) {
        toast.success(
          "Reset Password email sent successfully. Please check your email."
        );
        setInvitationSuccess(true);
        setEmail("");
      }
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.status === 404) {
        toast.error("Email address not found.");
      } else if (error.response && error.response.status === 403) {
        toast.error("Superadmin's password cannot be reset.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col  justify-between bg-blue-800 w-[50%] h-full p-10 text-white shadow-xl rounded-r-2xl  uppercase font-bold zumme">
        <div className="text-[120px] leading-[132px] w-[374px] h-[216px] ">
          <h1>Welcome</h1>
          <h1>Always !</h1>
        </div>
        <div className="w-[283px] h-[70px]">
          <img className="w-full" src="myClinic.png" alt="" />
        </div>
      </div>

      <div className="bg-white w-[50%] h-full ps-10   shadow-xl flex justify-center items-center montserrat">
        <div className="bg-[#f9f9f9] px-20 rounded-l-2xl h-[100%] w-[100%] flex items-center justify-center">
          <div className="w-full">
            <div className="text-center"></div>

            <div className="w-[95%] mx-auto mt-14">
              <form onSubmit={handleSubmitBtn}>
                <div>
                  <h2 className="text-[32px] font-semibold mb-4">
                    Forgot your password
                  </h2>
                  <p className="mb-6">
                    Please enter the email address you would like your password
                    reset information sent to
                  </p>
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block">
                    Email
                  </label>
                  <input
                    className={`auth-input border-[#7C7C7C] h-[60px] px-[20px] text-[18px] rounded-[10px]`}
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    required
                  />
                </div>
                <div className="text-right  my-5">
                  <Link
                    to="/login"
                    className=" text-[#2750FA] font-semibold cursor-pointer"
                  >
                    Back to Login?
                  </Link>
                </div>

                <Field>
                  {loading ? (
                    <button
                      type="button"
                      className="auth-input bg-blue-600 font-bold text-[20px] text-white transition-all hover:opacity-90 flex justify-center items-center"
                      disabled
                    >
                      <svg
                        className="animate-spin h-8 w-8 mr-3"
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
                      <span className="font-bold text-[20px]">
                        Processing...
                      </span>
                    </button>
                  ) : (
                    <button className="auth-input bg-blue-600 font-bold text-[20px] text-white transition-all hover:opacity-90">
                      Request reset link
                    </button>
                  )}
                </Field>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPage;
