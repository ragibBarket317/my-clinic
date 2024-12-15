/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../Store";

import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { formatDateV3 } from "../../utils/ultimateMegaFinalDateFormatter";

const UserLists = ({ user, data, onData, onDelete }) => {
  const {
    firstName,
    lastName,
    gender,
    dob,
    clinic,
    plan,
    benefityear,
    _id,
    age,
  } = user;
  const { auth } = useStore();

  const formattedDate = formatDateV3(dob);

  const userRole = auth?.data?.data?.data?.role;
  const navigate = useNavigate();
  const { t } = useTranslation();

  // const handleDelete = async () => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this user?"
  //   );
  //   if (!confirmDelete) return;
  //   try {
  //     const response = await axios.delete(
  //       `${
  //         import.meta.env.VITE_SERVER_BASE_URL
  //       }/api/v1/patient/delete-patient/${_id}`,
  //       { withCredentials: true }
  //     );

  //     if (response?.status === 200) {
  //       toast.success("User deleted successfully!");
  //       const afterDelete = data.filter((item) => item._id !== _id);
  //       onData(afterDelete);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching patient data:", error);
  //   }
  // };

  // Helper function to translate dynamic values
  const translateValue = (value) => {
    return t(value) || value;
  };

  const handleClick = () => {
    navigate(`/patientDashboard/${_id}`);
    // window.location.reload()
  };

  return (
    <div
      onClick={handleClick}
      className="bg-slate-100 dark:bg-slate-800 p-4 mb-7 rounded-sm"
    >
      <div>
        <div className="flex items-center justify-between capitalize">
          <h2 className="text-[16px] w-[15%]">
            {firstName.concat(" ", lastName)}
          </h2>

          <p className="text-[14px] w-[10%]">{translateValue(gender)}</p>
          <p className="text-[14px] w-[20%]">
            {formattedDate} ({age} {t("years")})
          </p>
          <p className="text-[14px] w-[10%] uppercase">{clinic}</p>
          <p className="text-[14px] w-[20%]">{translateValue(plan)}</p>
          <p className="text-[14px] w-[15%]">{benefityear}</p>
          {/* <div className="w-[8%]">
            <button
              className={
                userRole === "provider"
                  ? "text-[16px] bg-blue-800 px-4 py-[5px] text-white rounded-sm "
                  : "text-[16px] bg-blue-800 px-2 py-1 text-white rounded-sm mr-2"
              }
            >
              <Link to={`/patientDashboard/${_id}`}>
                <IoEyeOutline />
              </Link>
            </button>
            {userRole !== "provider" && (
              <button className=" text-[16px] bg-red-400 px-2 py-1 text-white rounded-sm">
                <Link onClick={() => onDelete(_id)}>
                  <MdDelete />
                </Link>
              </button>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserLists;
// to={`/patientDashboard/${_id}`}
