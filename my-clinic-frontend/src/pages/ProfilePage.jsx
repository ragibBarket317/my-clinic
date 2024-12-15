import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { VscEdit } from "react-icons/vsc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneNumberInput from "../components/PhoneNumberInput";

const pronouns = ["Mr.", "Mrs.", "Ms.", "Miss.", "Sr.", "Jr.", "Dr.", "Prof."];
const ProfilePage = () => {
  const { t } = useTranslation();
  const [showPass, setShowPass] = useState(false);
  const [oldShowPass, setoldShowPass] = useState(false);
  const [cnfPass, setCnfPass] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

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
      return t("Your password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      return t("Your password must contain at least one uppercase letter");
    }
    if (!/\d/.test(password)) {
      return t("Your password must contain at least one digit");
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return t("Your password must contain at least one special character");
    }
    return null;
  };

  const coverRef = useRef();
  const avatarRef = useRef();

  const handlePhoneNumberChange = (value) => {
    setUserInfo({ ...userInfo, phoneNumber: value });
  };

  const handleTogglePassword = () => {
    setShowPass(!showPass);
  };

  const handleToggleOldPassword = () => {
    setoldShowPass(!oldShowPass);
  };
  const handleToggleCnfPassword = () => {
    setCnfPass(!cnfPass);
  };
  async function updateUser() {
    try {
      setSubmitLoading(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/admins/update-account`,
        userInfo,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(t(`Profile updated successfully!`));
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        toast.error(t("Profile updated failed"));
      }
    } finally {
      setSubmitLoading(false);
    }
  }
  async function updateAvatar() {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/admins/avatar`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(t(`Avatar uploaded successfully!`));
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        toast.error(t("Avatar uploaded failed"));
      }
    } finally {
      setLoading(false);
    }
  }
  async function updateCover() {
    try {
      setCoverLoading(true);
      const formData = new FormData();
      formData.append("coverImage", coverFile);
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/admins/cover-image`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(t(`Cover image uploaded successfully!`));
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 404) {
        toast.error(t("Cover image uploaded failed"));
      }
    } finally {
      setCoverLoading(false);
    }
  }
  async function updatePassword() {
    try {
      setResetLoading(true);

      if (oldPassword === "" || password === "" || confirmPassword === "") {
        toast.error(t("All password field must be required."));
        return;
      }

      const passwordError = validatePassword();
      if (passwordError) {
        toast.error(passwordError);
        return;
      }

      if (password !== confirmPassword) {
        toast.error(t("New password and confirm new password do not match."));
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/admins/change-password`,
        {
          oldPassword,
          newPassword: password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setOldPassword("");
        setPassword("");
        setConfirmPassword("");
        toast.success(t(`Password updated successfully!`));
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.error(t("Invalid old password"));
      }
    } finally {
      setResetLoading(false);
    }
  }
  async function getUser() {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/admins/current-admin`,
      {
        withCredentials: true,
      }
    );
    if (response.data.success) {
      // console.log(response.data.data, "response.data.data");
      setUserInfo(response.data.data);
    }
  }
  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    if (coverFile) {
      updateCover();
    }
  }, [coverFile]);
  useEffect(() => {
    if (avatarFile) {
      updateAvatar();
    }
  }, [avatarFile]);

  useEffect(() => {
    updatePasswordChecks();
  }, [password]);

  return (
    <div>
      <div className="h-fit montserrat mt-4 ">
        <div
          className="flex justify-center bg-slate-400 h-[240px] rounded-lg relative overflow-hidden border"
          onMouseOver={() => {
            setShowCover(true);
          }}
          onMouseOut={() => {
            setShowCover(false);
          }}
        >
          <input
            onChange={(e) => {
              setCoverFile(e.target.files[0]);
              setCoverUrl(URL.createObjectURL(e.target.files[0]));
            }}
            ref={coverRef}
            className="hidden"
            type="file"
            name=""
            id=""
          />
          {coverLoading ? (
            <>
              <div className="w-full h-full object-cover bg-gray-700 flex items-center justify-center">
                <div>
                  <svg
                    className="animate-spin h-[60px] w-[60px]"
                    viewBox="0 0 800 800"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="400"
                      cy="400"
                      fill="none"
                      r="200"
                      strokeWidth="60"
                      stroke="#00308F"
                      strokeDasharray="1008 1400"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <img
              className="w-full h-full object-cover"
              src={coverUrl || userInfo?.coverImage || "coverImg.png"}
              alt=""
            />
          )}

          <span
            className={`absolute border border-gray-400 bottom-4 bg-slate-100 p-2 rounded-full cursor-pointer duration-300 ${
              showCover ? "right-6" : "-right-40"
            }`}
            onClick={() => coverRef.current.click()}
          >
            <VscEdit />
          </span>
        </div>
        <div className="flex items-center w-[170px] h-[170px] justify-center absolute top-[245px] left-[52%] ">
          <div
            className="relative rounded-full overflow-hidden"
            onMouseOver={() => {
              setShowAvatar(true);
            }}
            onMouseOut={() => {
              setShowAvatar(false);
            }}
          >
            <input
              onChange={(e) => {
                setAvatarFile(e.target.files[0]);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]));
              }}
              ref={avatarRef}
              className="hidden"
              type="file"
              name=""
              id=""
            />

            {loading ? (
              <>
                <div className="h-[162px] w-[162px] rounded-full object-cover bg-white dark:bg-gray-800 flex items-center justify-center">
                  <div>
                    <svg
                      className="animate-spin h-[60px] w-[60px]"
                      viewBox="0 0 800 800"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="400"
                        cy="400"
                        fill="none"
                        r="200"
                        strokeWidth="60"
                        stroke="#00308F"
                        strokeDasharray="1008 1400"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </>
            ) : (
              <img
                src={
                  avatarUrl ||
                  userInfo?.avatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmHkj6-Tndku8K2387sMaBf2DaiwfBtHQw951-fc9zzA&s"
                }
                className="h-[162px] w-[162px] rounded-full object-cover"
                alt=""
              />
            )}

            <span
              className={`absolute border border-gray-400 bottom-4 bg-slate-100 p-2 rounded-full cursor-pointer duration-300 ${
                showAvatar ? "right-8" : "-right-40"
              }`}
              onClick={() => avatarRef.current.click()}
            >
              <VscEdit />
            </span>
          </div>
        </div>
        <div className="mt-24 text-center mb-20 ">
          <h2 className="font-bold text-[42px] capitalize">
            {userInfo?.fullName}
          </h2>
          <p className="text-[18px]">{userInfo?.email}</p>
        </div>
        <div className="px-10 leading-8">
          <div className="border-b border-[#7C7C7C] pb-4">
            <h2 className="text-[25px] font-medium">{t("General Info")}</h2>
            <p className="text-[18px]">{t("Some General Information")}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-between p-10 text-[20px]">
          <div className="w-[47%] h-[65px] mb-6">
            <label htmlFor="fullName">{t("Full Name")} </label>
            <input
              type="text"
              className="auth-input border-gray-200 text-[18px] px-[20px] dark:bg-[--secondary]"
              placeholder="Jon Dou"
              name="fullName"
              value={userInfo?.fullName}
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div className="w-[47%] h-[65px] mb-6">
            <label htmlFor="fullName">{t("Title")} </label>
            <input
              type="text"
              className="auth-input border-gray-200 text-[18px] px-[20px] dark:bg-[--secondary]"
              placeholder="EX: Doctor"
              name="title"
              value={userInfo?.title}
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div className="w-[47%] h-[65px] mb-6">
            <label htmlFor="fullName">{t("Pronouns")} </label>
            <p>
              {" "}
              <select
                className="auth-input border-gray-200 text-[18px] px-[20px] dark:bg-[--secondary]"
                name="pronouns"
                value={userInfo?.pronouns}
                id=""
                onChange={(e) =>
                  setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
                }
              >
                {pronouns.map((pronoun, index) => (
                  <option key={index} value={pronoun}>
                    {pronoun}
                  </option>
                ))}
              </select>
            </p>
          </div>
          <div className="w-[47%] h-[65px] mb-6">
            <label htmlFor="fullName">{t("Email")} </label>
            <input
              type="email"
              className="auth-input border-gray-200 text-[18px] px-[20px] dark:bg-[--secondary]"
              placeholder="jon@dou.com"
              name="email"
              value={userInfo?.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
              disabled
            />
          </div>

          <div className="w-[47%] mb-6">
            <label htmlFor="fullName">{t("Phone Number")} </label>
            <PhoneNumberInput
              phoneNumber={userInfo?.phoneNumber}
              onHandlePhoneNumberChange={handlePhoneNumberChange}
            />
          </div>
        </div>
        <div className="px-10 leading-8 ">
          <div className="border-b border-[#7C7C7C] pb-4">
            <h2 className="text-[25px] font-medium">{t("Personal Info")}</h2>
            <p className="text-[18px]">{t("Some Personal Information")}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-between p-10 leading-8">
          <div className="w-[47%] h-[65px] mb-6">
            <label htmlFor="fullName">{t("Address/Street")} </label>
            <input
              type="text"
              className="auth-input border-gray-200 text-[18px] px-[20px] dark:bg-[--secondary]"
              placeholder="Enter Address"
              name="address"
              value={userInfo?.address}
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div className="w-[47%] h-[65px] mb-6">
            <label htmlFor="fullName">{t("City")} </label>
            <input
              type="text"
              className="auth-input border-gray-200 text-[18px] px-[20px] dark:bg-[--secondary]"
              placeholder="Enter City"
              name="city"
              value={userInfo?.city}
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div className="w-[47%] h-[65px] mb-6">
            <label htmlFor="fullName">{t("State/Province")} </label>
            <input
              type="text"
              className="auth-input border-gray-200 text-[18px] px-[20px] dark:bg-[--secondary]"
              placeholder="Enter State"
              name="state"
              value={userInfo?.state}
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div className="w-[47%] h-[65px] mb-6">
            <label htmlFor="fullName">{t("Zip Code")} </label>
            <input
              type="text"
              className="auth-input border-gray-200 text-[18px] px-[20px] dark:bg-[--secondary]"
              placeholder="Enter Zip Code"
              name="zipCode"
              autoComplete="off"
              value={userInfo?.zipCode}
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
            />
          </div>
        </div>
        <div className="pb-4 px-10 text-[20px]">
          {submitLoading ? (
            <button
              type="button"
              className="bg-theme text-theme-text p-2 px-4 flex justify-between items-center rounded-md font-bold transition-all hover:opacity-90"
              disabled
            >
              <svg
                className="animate-spin h-5 w-5 mr-2"
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
              <span className="font-bold text-[14px]">Processing...</span>
            </button>
          ) : (
            <button
              onClick={updateUser}
              className="rounded-md p-2 px-4 text-[14px] bg-theme text-theme-text font-bold  transition-all hover:opacity-90"
            >
              {t("Submit")}
            </button>
          )}
        </div>

        <div className="px-10 leading-8 ">
          <div className="border-b border-[#7C7C7C] pb-4">
            <h2 className="text-[25px] font-medium mt-8">
              {t("Change Password")}
            </h2>
            {/* <p className="text-[18px]">some general information</p> */}
          </div>
        </div>
        <div className="flex flex-wrap justify-between px-10 mt-8 text-[20px]">
          <div className="w-[47%] h-[65px] mb-6 relative">
            <label htmlFor="fullName">{t("Old Password")} </label>
            <div className="relative">
              <input
                type={oldShowPass ? "text" : "password"}
                className="auth-input border-gray-200 text-[18px] px-[20px] pr-10 dark:bg-[--secondary]"
                id="password"
                placeholder="******"
                autoComplete="new-password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center mr-2">
                {!oldShowPass ? (
                  <IoEyeOutline onClick={handleToggleOldPassword} />
                ) : (
                  <FaRegEyeSlash onClick={handleToggleOldPassword} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between px-10 mt-8 text-[20px] dark:bg-[--secondary]">
          <div className="w-[47%] h-[65px] mb-6 relative">
            <label htmlFor="password">{t("New Password")}</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="auth-input border-gray-200 text-[18px] px-[20px] pr-10 dark:bg-[--secondary]"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
              />
              <div className="absolute inset-y-0 right-0 flex items-center mr-2">
                {!showPass ? (
                  <IoEyeOutline onClick={handleTogglePassword} />
                ) : (
                  <FaRegEyeSlash onClick={handleTogglePassword} />
                )}
              </div>
            </div>
          </div>
          <div className="w-[47%] h-[65px] mb-6 relative">
            <label htmlFor="password">{t("Confirm New Password")}</label>
            <div className="relative">
              <input
                type={cnfPass ? "text" : "password"}
                className="auth-input border-gray-200 text-[18px] px-[20px] pr-10 dark:bg-[--secondary]"
                id="password"
                placeholder="******"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center mr-2">
                {!cnfPass ? (
                  <IoEyeOutline onClick={handleToggleCnfPassword} />
                ) : (
                  <FaRegEyeSlash onClick={handleToggleCnfPassword} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="px-10 text-[14px] space-x-3 my-[12px]">
          <input type="checkbox" checked={passwordChecks.length} />
          <label htmlFor="character">{t("6 Characters")}</label>
          <input type="checkbox" checked={passwordChecks.uppercase} />
          <label htmlFor="uppercase">{t("Uppercase")}</label>
          <input type="checkbox" checked={passwordChecks.number} />
          <label htmlFor="number">{t("Number")}</label>
          <input type="checkbox" checked={passwordChecks.specialChar} />
          <label htmlFor="specialCharacter">{t("Special Character")}</label>
        </div>
        <div className="pb-4 px-10 text-[20px]">
          {resetLoading ? (
            <button
              type="button"
              className="bg-theme text-theme-text p-2 px-4 flex justify-between items-center rounded-md font-bold transition-all hover:opacity-90"
              disabled
            >
              <svg
                className="animate-spin h-5 w-5 mr-2"
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
              <span className="font-bold text-[14px]">Processing...</span>
            </button>
          ) : (
            <button
              onClick={updatePassword}
              className="rounded-md p-2 px-4 text-[14px] bg-theme text-theme-text font-bold  transition-all hover:opacity-90"
            >
              {t("Reset")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
