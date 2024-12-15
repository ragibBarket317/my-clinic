/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsCheck2Circle } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { TbEditCircle } from "react-icons/tb";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDateV3 } from "../../utils/ultimateMegaFinalDateFormatter";
import { useStore } from "../Store";

const MemberInfo = ({ member, memberData, onMemberData }) => {
  const [editMemberInfo, setEditMemberInfo] = useState(false);
  const [role, setRole] = useState(member.role);
  const { auth } = useStore();
  const { t } = useTranslation();

  const userRole = auth?.data?.data?.data?.role;

  const formattedDate = formatDateV3(member.createdAt);

  const id = member._id;

  const handleDelete = async () => {
    toast.warn(
      <div>
        <p className="mb-4">{t("Are you sure you want to delete?")}</p>
        <button
          onClick={handleDeleteUser}
          className="bg-theme py-[2px] px-[8px] rounded-md text-white mr-2"
        >
          {t("Yes")}
        </button>
        <button
          onClick={() => toast.dismiss()}
          className="bg-red-600 py-[2px] px-[8px] rounded-md text-white mr-2"
        >
          {t("No")}
        </button>{" "}
        {/* Dismiss the toast with ID */}
      </div>,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: id, // Use the note ID as the toast ID
        icon: false,
      }
    );
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/admins/delete-admin/${id}`,
        { withCredentials: true }
      );

      if (response?.status === 200) {
        toast.dismiss();
        toast.success(t("Delete successfully!"), {
          className: "toast-custom",
        });
        const afterDelete = memberData.filter((item) => item._id !== id);
        onMemberData(afterDelete);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      toast.error("Something went wrong!", {
        className: "toast-custom",
      });
    }
  };

  const handleMemberEdit = async () => {
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/admins/update-admin/${id}`,
        { role },
        { withCredentials: true }
      );

      const updatedMember = response?.data?.data;

      if (response?.status === 200) {
        toast.success("Update Successful!");
        setRole(updatedMember.role);

        // Update memberData with the updated member object
        const updatedData = memberData.map((item) =>
          item._id === id ? updatedMember : item
        );
        onMemberData(updatedData);

        // Exit edit mode
        setEditMemberInfo(false);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-4 mb-7 rounded-sm">
      <div>
        <div className="flex items-center justify-between">
          {editMemberInfo ? (
            <>
              <h2 className="text-[16px] w-[18%]">{member?.fullName}</h2>
              <div className="w-[18%]">
                <p className="text-[14px] w-[25%]">{member?.email}</p>
              </div>
              <div className="w-[18%]">
                <select
                  className="auth-lebel dark:bg-[--secondary] w-[90%] text-[16px] h-[45px] px-2 rounded-[10px]"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  {userRole === "superadmin" && (
                    <option value="admin">Admin</option>
                  )}
                  <option value="provider">Provider</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <div className="w-[18%]">
                <p className="text-[14px]">{formattedDate}</p>
              </div>
              <div className="w-[18%]">-</div>
            </>
          ) : (
            <>
              <h2 className="text-[16px] w-[18%]">{member?.fullName}</h2>
              <p className="text-[14px] w-[25%] truncate hover:text-clip mr-2 text-nowrap">
                {member?.email}
              </p>
              <p className="text-[14px] w-[18%]">{member?.role}</p>
              <p className="w-[18%] text-[14px]">{formattedDate}</p>
              <p className="w-[18%] text-[14px]">
                {member?.location ? member.location : "-"}
              </p>
              <p className="w-[18%] text-[14px]">
                {member?.isActive ? "Accepted" : "Not Accepted"}
              </p>
            </>
          )}

          <button className="w-[10%] text-[20px] text-black px-2 py-1 rounded-sm">
            <div className="flex gap-[8px] items-center">
              {editMemberInfo ? (
                <>
                  <Link className="text-blue-800">
                    <BsCheck2Circle
                      className="text-[24px]"
                      onClick={handleMemberEdit}
                    />
                  </Link>
                </>
              ) : (
                <>
                  <Link className="text-blue-800">
                    <TbEditCircle
                      className="text-[24px]"
                      onClick={() => setEditMemberInfo(true)}
                    />
                  </Link>
                </>
              )}
              <Link onClick={handleDelete} className="text-red-500">
                <MdDelete className="text-[24px]" />
              </Link>
            </div>
          </button>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default MemberInfo;
