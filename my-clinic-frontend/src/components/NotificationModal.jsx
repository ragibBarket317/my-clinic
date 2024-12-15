import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
const NotificationModal = ({
  onCloseAddModal,
  onSetIsAddModalOpen,
  onCloseEditModalOpen,
  isEditModalOpen,
  id,
  noteId,
  patientData,
  setIsEditModalOpen,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (isEditModalOpen) {
      const editItem = patientData.openedNotes.find(
        (note) => note._id === noteId
      );
      if (editItem) {
        setTitle(editItem.title);
        setDescription(editItem.description);
      }
    } else {
      setTitle("");
      setDescription("");
    }
  }, [isEditModalOpen, noteId, patientData]);

  const handleAddNote = async () => {
    if (title === "") {
      toast.error(t("Title is required."), {
        className: "toast-custom",
      });
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/notes/add-note`,
        {
          patientId: id,
          title,
          description,
        },
        { withCredentials: true }
      );
      if (response?.status === 201) {
        window.location.href = `${window.location.origin}${window.location.pathname}?success=Note created successfully!`;
        const newNote = {
          _id: response.data.data._id,
          title,
          description,
        };

        // Update the state with the new note at the beginning
        patientData.openedNotes.unshift(newNote);

        onSetIsAddModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditNote = async () => {
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/notes/update-note/${noteId}`,
        {
          title,
          description,
        },
        { withCredentials: true }
      );

      if (response?.status === 200) {
        window.location.href = `${window.location.origin}${window.location.pathname}?success=Note updated successfully!`;
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white dark:bg-[--secondary] p-8 rounded shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            {isEditModalOpen ? t("Edit Note") : t("Add a Note")}
          </h2>
          <input
            type="text"
            placeholder="Enter title"
            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full dark:bg-[--secondary]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            // Disable editing if in edit mode
          />
          <textarea
            placeholder="Enter description"
            className="border border-gray-300 rounded px-3 py-1 mb-4 w-full resize-none dark:bg-[--secondary]"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            // Disable editing if in edit mode
          ></textarea>
          <div className="flex justify-end">
            {/* Button to submit or edit note */}
            <button
              className="bg-theme text-theme-text px-4 py-2 rounded"
              onClick={isEditModalOpen ? handleEditNote : handleAddNote}
            >
              {isEditModalOpen ? t("Edit") : t("Add")}
            </button>
            {/* Button to close the modal */}
            <button
              className="bg-gray-300 text-gray-800 ml-2 px-4 py-2 rounded"
              onClick={isEditModalOpen ? onCloseEditModalOpen : onCloseAddModal}
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationModal;
