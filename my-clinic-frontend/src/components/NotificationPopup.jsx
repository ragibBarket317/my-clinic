import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit3 } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { getTimeElapsed } from "../../utils/getTimeElapsed";
import { useStore } from "../Store";
import NotificationModal from "./NotificationModal";

const NotificationPopup = ({ id, patientData, onPatientData }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [resolvedNote, setResolvedNote] = useState([]);
  const [activeTab, setActiveTab] = useState("open");
  const [noteId, setNoteId] = useState(null);
  const { t } = useTranslation();

  const { auth } = useStore();

  const userRole = auth?.data?.data?.data?.role;

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (id) => {
    setIsEditModalOpen(true);
    setNoteId(id);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleDelete = async (id) => {
    toast.warn(
      <div>
        <p className="mb-4">{t("Are you sure you want to delete?")}</p>
        <button
          onClick={() => deleteNote(id)}
          className="bg-theme py-[2px] px-[8px] rounded-md text-white mr-2"
        >
          {t("Yes")}
        </button>
        <button
          onClick={() => toast.dismiss(id)}
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

  const deleteNote = async (id) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/notes/delete-note/${id}`,
        { withCredentials: true }
      );

      if (response?.status === 204) {
        // Update state to remove the deleted note
        if (activeTab === "open") {
          const updatedOpenedNotes = patientData.openedNotes.filter(
            (note) => note._id !== id
          );
          onPatientData({
            ...patientData,
            openedNotes: updatedOpenedNotes,
          });
        } else {
          const updatedresolvedNotes = patientData.resolvedNotes.filter(
            (note) => note._id !== id
          );
          onPatientData({
            ...patientData,
            resolvedNotes: updatedresolvedNotes,
          });
        }

        // Dismiss the toast when the note is deleted
        toast.dismiss(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResolvedNote = async (id) => {
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/notes/toggle-note-resolve/${id}`,
        {},
        { withCredentials: true }
      );

      if (response?.status === 200) {
        window.location.href = `${window.location.origin}${window.location.pathname}?success=Note resolved successfully!`;
        setResolvedNote(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="absolute z-10 top-full right-[0px] mt-2 mr-2 w-[300px] py-2 px-2 bg-white dark:bg-[--secondary] border border-gray-300 rounded-md shadow-md">
        <div>
          {/* <div className="flex justify-between items-center mb-4"> */}
          {/* <button className="text-blue-500" onClick={onClosePopup}>Close</button> */}
          <div className="flex justify-between items-center border-b pb-2 px-2 mb-4">
            <div className="w-[45%] border-e">
              <button
                className={`cursor-pointer ${
                  activeTab === "open"
                    ? "text-theme font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => switchTab("open")}
              >
                {t("Opened")} <span>({patientData?.openedNotes?.length})</span>
              </button>
            </div>

            {userRole !== "provider" && (
              <div className="w-[45%]">
                <button
                  className={`cursor-pointer ${
                    activeTab === "resolved"
                      ? "text-theme font-semibold"
                      : "text-gray-500"
                  }`}
                  onClick={() => switchTab("resolved")}
                >
                  {t("Resolved")}{" "}
                  <span>({patientData?.resolvedNotes?.length})</span>
                </button>
              </div>
            )}
          </div>
          {/* </div> */}
          <div className="h-60  overflow-y-auto">
            {/* Content based on active tab */}
            {activeTab === "open" ? (
              <div className="pl-4 pb-1 space-y-2">
                {patientData?.openedNotes?.map((note) => (
                  <div key={note._id} className="py-2 border-b">
                    <h2 className="text-[18px]">{note.title}</h2>
                    <p className="text-[12px] text-gray-500">
                      {getTimeElapsed(note.createdAt)}
                    </p>
                    <p className="text-[16px]">{note.description}</p>
                    {userRole !== "provider" && (
                      <div className="text-right py-2">
                        <button
                          onClick={() => handleResolvedNote(note._id)}
                          className="bg-blue-500 text-white p-[3px] mr-2 rounded-full"
                          title={t("Resolve Note")}
                        >
                          {" "}
                          <IoMdCheckmark />
                        </button>
                        <button
                          onClick={() => openEditModal(note._id)}
                          className="bg-green-500 text-white p-[3px] mr-2 rounded-full"
                          title={t("Edit Note")}
                        >
                          {" "}
                          <FiEdit3 />
                        </button>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="bg-red-500 text-white p-[3px] mr-2 rounded-full"
                          title={t("Delete Note")}
                        >
                          {" "}
                          <RxCross2 />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="pl-4 pb-1 space-y-2">
                {patientData?.resolvedNotes?.map((note) => (
                  <div key={note._id} className="py-2 border-b">
                    <h2 className="text-[18px]">{note.title}</h2>
                    <p className="text-[12px] text-gray-500">
                      {getTimeElapsed(note.createdAt)}
                    </p>
                    <p className="text-[16px]">{note.description}</p>
                    <div className="text-right py-2">
                      <button
                        onClick={() => handleResolvedNote(note._id)}
                        className="bg-blue-500 text-white p-[3px] mr-2 rounded-full"
                        title="Re-open Note"
                      >
                        {" "}
                        <IoMdCheckmark />
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="bg-red-500 text-white p-[3px] mr-2 rounded-full"
                        title="Delete Note"
                      >
                        {" "}
                        <RxCross2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {userRole !== "provider" && (
            <div className="mt-4">
              {/* Button to open Add Note modal */}
              <button
                className="bg-theme text-theme-text px-4 py-2 rounded w-full"
                onClick={openAddModal}
              >
                {t("Add a Note")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <NotificationModal
          onCloseAddModal={closeAddModal}
          onSetIsAddModalOpen={setIsAddModalOpen}
          onCloseEditModalOpen={closeEditModal}
          isEditModalOpen={isEditModalOpen}
          id={id}
          patientData={patientData}
          noteId={noteId}
          setIsEditModalOpen={setIsEditModalOpen}
        />
      )}
    </>
  );
};

export default NotificationPopup;
