import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "../Store";
import Field from "../components/common/Field";
const ResetPasswordPage = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useStore();


  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const updatePasswordChecks = () => {
    setPasswordChecks({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[^a-zA-Z0-9]/.test(password),
    });
  };

  const validatePassword = () => {
    if (password.length < 6) {
      return "Your password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Your password must contain at least one uppercase letter";
    }
    if (!/\d/.test(password)) {
      return "Your password must contain at least one digit";
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return "Your password must contain at least one special character";
    }
    return null;
  };

  const handleSubmitBtn = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Your password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const passwordError = validatePassword();
      if (passwordError) {
        toast.error(passwordError);
        return;
      }

      if (password !== confirmPass) {
        toast.error("New password and confirm new password do not match");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/admins/reset-password`,
        { token, newPassword: password },
        { withCredentials: true }
      );

      if (response?.status === 200) {
        toast.success("Password Reset Succesfull! Please Login!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updatePasswordChecks();
  }, [password]);
  useEffect(() => {
    if (auth?.data?.data?.data?.email) {
      navigate("/");
    }
  }, [auth]);
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
            <div className="text-center">
              <h1 className="text-[54px] font-bold mb-2">Reset Password</h1>
            </div>

            <div className="w-[95%] mx-auto mt-14">
              <form onSubmit={handleSubmitBtn}>
                <div className="mb-6">
                  <div className="relative">
                    <label htmlFor="firstName" className="mb-2 block">
                      New Password
                    </label>
                    <input
                      className={`auth-input border-[#7C7C7C] h-[60px] px-[20px] text-[18px] rounded-[10px]`}
                      type={showPass ? "text" : "password"}
                      name="password"
                      id="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      placeholder="Enter your Password"
                      required
                    />

                    <div className="absolute cursor-pointer inset-y-0 top-1/2 right-0 flex items-center mr-2">
                      <div className="">
                        {!showPass ? (
                          <IoEyeOutline
                            onClick={() => setShowPass(!showPass)}
                          />
                        ) : (
                          <FaRegEyeSlash
                            onClick={() => setShowPass(!showPass)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <label htmlFor="firstName" className="mb-2 block">
                      Confirm New Password
                    </label>
                    <input
                      className={`auth-input border-[#7C7C7C] h-[60px] px-[20px] text-[18px] rounded-[10px]`}
                      type={showConfirmPass ? "text" : "password"}
                      name="password"
                      id="password"
                      onChange={(e) => setConfirmPass(e.target.value)}
                      value={confirmPass}
                      placeholder="Enter your Password"
                      required
                    />
                    <div className="absolute cursor-pointer inset-y-0 top-1/2 right-0 flex items-center mr-2">
                      <div className="">
                        {!showConfirmPass ? (
                          <IoEyeOutline
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                          />
                        ) : (
                          <FaRegEyeSlash
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-red-500 my-5">{error}</p>
                <div className="text-[14px] space-x-3 my-[12px]">
                  <input type="checkbox" checked={passwordChecks.length} />
                  <label>6 Characters</label>
                  <input type="checkbox" checked={passwordChecks.uppercase} />
                  <label>Uppercase</label>
                  <input type="checkbox" checked={passwordChecks.number} />
                  <label>Number</label>
                  <input type="checkbox" checked={passwordChecks.specialChar} />
                  <label>Special Character</label>
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
                      <span className="font-bold text-[20px]">
                        Processing...
                      </span>
                    </button>
                  ) : (
                    <button className="auth-input bg-blue-600 font-bold text-[20px] text-white transition-all hover:opacity-90">
                      Reset Password
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

export default ResetPasswordPage;
