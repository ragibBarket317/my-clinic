import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { calculateDynamicHeight } from "../../utils/calculateHeight";
import AdminInviteModal from "../components/AdminInviteModal";
import MemberInfo from "../components/MemberInfo";
import Paginate from "../components/Paginate";

const LIMIT = 30;
const ManageMembersPage = () => {
  const { t } = useTranslation();
  const [memberData, setMemberData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageCount, setPageCount] = useState(null);
  const [currPage, setCurrPage] = useState(1);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchMemberData = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/admins/admins-list?page=${currPage}&limit=${LIMIT}`,
        { withCredentials: true }
      );

      const data = response?.data?.data;

      if (response.status === 200) {
        setMemberData(data?.admins);
        setPageCount(data?.totalPages);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, [currPage]);

  const handleInviteSuccess = async () => {
    await fetchMemberData();
  };

  return (
    <div
      className="lato"
      style={{ height: calculateDynamicHeight(memberData.length) }}
    >
      <div>
        <div className="examinations space-y-6 bg-white dark:bg-[--secondary] shadow-xl px-8 py-6 rounded-lg text-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-lg text-slate-900 dark:text-[--text]">
                {t("Members List")}
              </span>
            </div>
            <div>
              <button
                onClick={openModal}
                className="rounded-md p-2 px-4 text-[14px] bg-theme text-theme-text font-bold  transition-all hover:opacity-90 "
              >
                {t("Invite")}
              </button>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-4 mb-4 rounded-sm text-[16px] font-semibold">
              <p className="w-[18%]">{t("Full Name")}</p>
              <p className="w-[25%]">{t("Email")}</p>
              <p className="w-[18%]">{t("Account Type")}</p>
              <p className="w-[18%]">{t("Date Joined")}</p>
              <p className="w-[18%]">{t("Location")}</p>
              <p className="w-[18%]">{t("Status")}</p>
              <p className="w-[10%]">{t("Action")}</p>
            </div>
            {memberData.map((member) => (
              <MemberInfo
                key={member._id}
                member={member}
                onMemberData={setMemberData}
                memberData={memberData}
              />
            ))}

            <div>
              <Paginate
                limit={LIMIT}
                currPage={currPage}
                setCurrPage={setCurrPage}
                pageCount={pageCount}
              />
            </div>
          </div>

          <AdminInviteModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onHandleInviteSuccess={handleInviteSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageMembersPage;
