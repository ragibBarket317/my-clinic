import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CiSaveDown2 } from "react-icons/ci";
import { FcPrivacy } from "react-icons/fc";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { formatDateV3 } from "../../utils/ultimateMegaFinalDateFormatter";
import { useStore } from "../Store";
import Paginate from "../components/Paginate";
const LIMIT = 10;
const DocumentPage = () => {
  const { auth } = useStore();
  const { t } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [fileList, setFileList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPrivacy, setSelectedPrivacy] = useState(null);
  const [selectedEditPrivacy, setSelectedEditPrivacy] = useState(null);
  const [needFetch, setNeedFetch] = useState(0);
  const [pageCount, setPageCount] = useState(null);
  const [currPage, setCurrPage] = useState(1);

  const handleFileUpload = (event) => {
    event.preventDefault();

    const currentFiles = uploadedFiles.length;

    const newFiles = Array.from(event.target.files);

    if (currentFiles + newFiles.length > 10) {
      toast.warn(t("Cannot upload more than 10 files."), {
        className: "toast-custom",
      });
      return;
    }

    let files = [];
    newFiles.forEach((file) => {
      files.push({
        fileData: file,
        visibility: "public",
        permission: [],
        id: uuid(),
      });
    });

    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    event.target.value = null;
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const currentFiles = uploadedFiles.length;

    const newFiles = Array.from(event.dataTransfer.files);

    if (currentFiles + newFiles.length > 10) {
      toast.warn(t("Cannot upload more than 10 files."), {
        className: "toast-custom",
      });
      return;
    }

    let files = [];
    newFiles.forEach((file) => {
      files.push({
        fileData: file,
        visibility: "public",
        permission: [],
        id: uuid(),
      });
    });

    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };
  const changePrivacy = (id, visibility, selectedUsers) => {
    const temp = [...uploadedFiles];
    temp.forEach((file, idx) => {
      if (file.id === id) {
        temp[idx] = {
          ...temp[idx],
          visibility,
          permission: selectedUsers,
        };
        setUploadedFiles(temp);
        return;
      }
    });
    setSelectedPrivacy(null);
    // setNeedFetch((prev) => prev + 1);
  };

  const changeEditPrivacy = async (id, visibility, selectedUsers) => {
    const response = await axios.patch(
      `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/documents/edit/${id}`,
      {
        visibility,
        permission: selectedUsers,
      },
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      toast.success(t("Document Visibility Changed Successfully!"), {
        className: "toast-custom",
      });
    }
    setSelectedEditPrivacy(null);

    setNeedFetch((prev) => prev + 1);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append("documents", file.fileData);
    });
    formData.append("documentDatas", JSON.stringify(uploadedFiles));

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/documents/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress({ percentCompleted });
          },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        setFileList((prevList) => [...response.data.data, ...prevList]);
        setUploadedFiles([]);
        setUploadProgress({});
        toast.success(t("Upload successfully!"), {
          className: "toast-custom",
        });
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    toast.warn(
      <div>
        <div
          style={{
            display: "flex",
            marginBottom: "10px",
          }}
        >
          <div>
            <span
              style={{ fontSize: "24px", color: "#FFA500", marginRight: "8px" }}
            >
              ⚠️
            </span>
          </div>

          <p className="mb-4">{t("Are you sure you want to delete?")}</p>
        </div>

        <div>
          <button
            onClick={() => deleteFile(id)}
            className="bg-theme text-theme-text py-[2px] px-[8px] rounded-md mr-2"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(id)}
            className="bg-red-600 py-[2px] px-[8px] rounded-md text-white mr-2"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-right",
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

  const deleteFile = async (fileId) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/documents/delete/${fileId}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success(t("Delete successfully!"), {
          className: "toast-custom",
        });
        setFileList((prevList) =>
          prevList.filter((file) => file._id !== fileId)
        );

        // Dismiss the toast when the note is deleted
        toast.dismiss(fileId);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/documents/download/${fileId}`,
        {
          //   responseType: "blob",
          withCredentials: true,
        }
      );

      //   const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = response.data.url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const removeFile = (id) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const fetchDocumentApi = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/documents/all?page=${currPage}&limit=${LIMIT}`,
          { withCredentials: true }
        );

        if (response?.status === 200) {
          setFileList(response?.data?.documents[0]?.paginatedResults);
          setPageCount(
            Math.ceil(
              response?.data?.documents[0]?.totalCount[0]?.total / LIMIT
            )
          );
          setUsers(response?.data?.users);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocumentApi();
  }, [needFetch, currPage, LIMIT]);

  // Filter files based on search query
  const filteredFiles = fileList.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row p-6 min-h-screen relative">
      {showModal && (
        <PrivacyModal
          setShowModal={setShowModal}
          selectedPrivacy={selectedPrivacy}
          setSelectedPrivacy={setSelectedPrivacy}
          changePrivacy={changePrivacy}
          users={users}
        />
      )}
      {showEditModal && (
        <EditPrivacyModal
          setShowEditModal={setShowEditModal}
          selectedEditPrivacy={selectedEditPrivacy}
          setSelectedEditPrivacy={setSelectedEditPrivacy}
          changeEditPrivacy={changeEditPrivacy}
          users={users}
        />
      )}

      {/* Main Content */}
      <div className="w-full md:w-3/4 bg-white dark:bg-[--secondary] rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-100">
            {t("Documents")}
          </h1>
        </div>
        <div className="mb-6 relative w-[50%]">
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              id="search"
              onChange={handleInputChange}
              className="px-3 py-2 outline-none border rounded-lg border-gray-200 w-full text-black"
              type="text"
              placeholder="Search by file Name"
            />
            <button
              type="submit"
              className="absolute right-2 top-0 h-full rounded-e-lg text-white md:right-4"
            >
              <svg
                className="h-4 w-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="py-4 pl-2 text-left">{t("Name")}</th>
                <th className="py-4 text-center">{t("Size")}</th>
                <th className="py-4 text-center">{t("Date")}</th>
                <th className="py-4 text-center">{t("Uploaded by")}</th>
                <th className="py-4 text-center">{t("Action")}</th>
              </tr>
            </thead>
            <tbody className="bg-slate-100 dark:bg-slate-500">
              {filteredFiles.length > 0 ? (
                <>
                  {filteredFiles.map((file) => (
                    <tr
                      key={file._id}
                      className="text-gray-700 dark:text-gray-100 overflow-hidden"
                    >
                      <td className="py-4 pl-2 border-b-8 border-white dark:border-[--secondary]">
                        <div className="truncate max-w-[200px] relative group">
                          <span className="cursor-pointer" title={file.name}>
                            {file.name}
                          </span>
                          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                            {file.name}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center border-b-8 border-white dark:border-[--secondary]">
                        {(file.size / 1024).toFixed(2)} KB
                      </td>
                      <td className="py-4 text-center border-b-8 border-white dark:border-[--secondary]">
                        {formatDateV3(file.updatedAt)}
                      </td>
                      <td className="py-4 text-center border-b-8 border-white dark:border-[--secondary]">
                        {file.uploadedBy}
                      </td>
                      <td className="py-4 text-center border-b-8 border-white dark:border-[--secondary]">
                        <button
                          onClick={() => downloadFile(file._id, file.name)}
                          className="text-theme dark:text-theme-800 font-medium hover:text-theme-700 hover:rounded-full hover:bg-gray-300 hover:shadow-lg hover:opacity-75 transition duration-300 ease-in-out transform hover:scale-105 mr-2"
                        >
                          <CiSaveDown2 className="text-[20px] font-bold" />
                        </button>
                        {auth?.data?.data?.data?._id === file.uploaderId && (
                          <>
                            <button
                              onClick={() => {
                                setShowEditModal(true);
                                setSelectedEditPrivacy(file);
                              }}
                              className="text-red-500 hover:text-red-700 hover:rounded-full hover:bg-gray-300 hover:shadow-lg hover:opacity-75 transition duration-300 ease-in-out transform hover:scale-105 mr-2"
                            >
                              <FcPrivacy className="text-[20px]" />
                            </button>
                            <button
                              onClick={() => handleDelete(file._id)}
                              className="text-red-500 hover:text-red-700 hover:rounded-full hover:bg-gray-300 hover:shadow-lg hover:opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
                            >
                              <MdDelete className="text-[20px]" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  {searchQuery === "" ? (
                    <>
                      <tr className="bg-white dark:bg-[--secondary]">
                        <td className=" py-4">{t("There is no file here")}.</td>
                        <td className=" py-4"></td>
                        <td className=" py-4"></td>
                        <td className=" py-4"></td>
                        <td className=" py-4"></td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="bg-white dark:bg-[--secondary]">
                        <td className=" py-4">
                          {t("Search file is not found")}.
                        </td>
                        <td className=" py-4"></td>
                        <td className=" py-4"></td>
                        <td className=" py-4"></td>
                        <td className=" py-4"></td>
                      </tr>
                    </>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div>
          <Paginate
            limit={LIMIT}
            setCurrPage={setCurrPage}
            currPage={currPage}
            pageCount={pageCount}
          />
        </div>
      </div>
      {/* Sidebar */}
      <div
        className="w-full md:w-1/4 bg-white rounded-lg shadow-lg p-6 mb-6 md:mb-0 md:ml-6 dark:bg-[--secondary]"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="border-dashed border-4 border-gray-300 p-6 text-center mb-6">
          <input
            type="file"
            multiple
            className="hidden"
            id="file-upload"
            name="file-upload"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-gray-500 mb-2 flex justify-center">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-12 h-12 mx-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m6-6H6"
                />
              </svg> */}
              <MdCloudUpload className="text-[36px]" />
            </div>
            <p className="text-gray-600 dark:text-gray-100">
              {t("Drag And Drop Your Files Here")}, {t("or")}{" "}
              <span className="text-theme underline">{t("Upload file")}</span>.
            </p>
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
              {t("Uploaded Files")}
            </h2>
            <ul className="mt-4 space-y-4">
              {uploadedFiles.map((file, index) => (
                <div key={index}>
                  <li className=" p-2 bg-slate-100 dark:bg-slate-500 rounded-lg text-xs">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-4 h-4 text-theme"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8.25V6a3 3 0 013-3h12a3 3 0 013 3v2.25M21 9l-9 9-9-9"
                          />
                        </svg>
                      </div>
                      <div className="ml-4 overflow-hidden">
                        <p
                          className="text-gray-700 dark:text-gray-100"
                          title={file.fileData.name}
                        >
                          {file.fileData.name}
                        </p>
                        <p className="text-gray-500 dark:text-gray-300">
                          {(file.fileData.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2 mt-4">
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setSelectedPrivacy(file);
                        }}
                        className="shadow-lg rounded-full bg-gray-200 dark:bg-gray-600 p-[7px] text-red-500 hover:text-red-700"
                      >
                        <FcPrivacy className="text-[16px]" />
                      </button>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="shadow-lg rounded-full bg-gray-200 dark:bg-gray-600 p-[2px] text-red-500 hover:text-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
            {isLoading ? (
              <button
                type="button"
                className="mt-4 bg-theme text-theme-text py-2 px-4 flex justify-between items-center rounded-md font-bold transition-all hover:opacity-90"
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
              <button
                onClick={uploadFiles}
                className="mt-4 bg-theme text-theme-text  py-2 px-4 rounded-lg hover:bg-theme-hover"
              >
                {t("Uploaded Files")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PrivacyModal = ({
  setShowModal,
  selectedPrivacy,
  setSelectedPrivacy,
  changePrivacy,
  users,
}) => {
  const [visibility, setVisibility] = useState("public");
  const [isPublic, setIsPublic] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 lato text-[16px]">
      <div className="bg-white dark:bg-[--secondary] rounded-md p-8 shadow-lg space-y-4 max-h-[500px] w-[35%]">
        <h1 className="text-xl font-bold">{t("Set Visibility")} :</h1>
        <div className="flex items-center gap-x-4">
          <label className="cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => {
                setIsPublic(e.target.checked);
                if (e.target.checked) {
                  setIsPrivate(false);
                  setSelectedUsers([]);
                }
              }}
            />
            <span className="ml-2">{t("Public")}</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => {
                setIsPrivate(e.target.checked);
                if (e.target.checked) {
                  setIsPublic(false);
                }
              }}
            />
            <span className="ml-2">{t("Private")}</span>
          </label>
        </div>
        <div>
          <p className="text-xl font-bold mb-2">{t("Users")} :</p>
          <div className="overflow-y-scroll space-y-2 #text-lg">
            {users?.map((user) => (
              <label key={user._id} className="block">
                {" "}
                <input
                  checked={selectedUsers.includes(user._id)}
                  onChange={(e) => {
                    let set = new Set(selectedUsers);
                    if (e.target.checked) {
                      set.add(user._id);
                    } else {
                      set.has(user._id) && set.delete(user._id);
                    }
                    setIsPublic(false);
                    setIsPrivate(true);
                    setSelectedUsers(Array.from(set));
                  }}
                  type="checkbox"
                  name=""
                  id=""
                />{" "}
                {user.fullName}
              </label>
            ))}
          </div>
        </div>
        <div>
          <button
            className="bg-theme text-theme-text px-2 py-1 rounded-lg mr-4"
            onClick={() => {
              if (isPublic && !isPrivate) {
                changePrivacy(selectedPrivacy.id, "public", []);
              } else if (!isPublic && isPrivate) {
                changePrivacy(selectedPrivacy.id, "private", selectedUsers);
              }
              setShowModal(false);
            }}
          >
            {t("Set Privacy")}
          </button>
          <button
            className="bg-theme text-theme-text px-2 py-1 rounded-lg mr-4"
            onClick={() => {
              setShowModal(false);
              setSelectedPrivacy(null);
            }}
          >
            {t("Close")}
          </button>
        </div>
      </div>
    </div>
  );
};
const EditPrivacyModal = ({
  setShowEditModal,
  selectedEditPrivacy,
  setSelectedEditPrivacy,
  changeEditPrivacy,
  users,
}) => {
  const [visibility, setVisibility] = useState("public");
  const [isPublic, setIsPublic] = useState(
    selectedEditPrivacy.visibility === "public"
  );
  const [isPrivate, setIsPrivate] = useState(
    selectedEditPrivacy.visibility === "private"
  );
  const [selectedUsers, setSelectedUsers] = useState(
    selectedEditPrivacy.permission
  );

  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 lato text-[16px]">
      <div className="bg-white dark:bg-[--secondary] rounded-md p-8 shadow-lg space-y-4 max-h-[500px] w-[35%]">
        <h1 className="text-xl font-bold">{t("Edit Visibility")} :</h1>
        <div className="flex items-center gap-x-4">
          <label className="cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => {
                setIsPublic(e.target.checked);
                if (e.target.checked) {
                  setIsPrivate(false);
                  setSelectedUsers([]);
                }
              }}
            />
            <span className="ml-2">{t("Public")}</span>
          </label>
          <label className="cursor-pointer">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => {
                setIsPrivate(e.target.checked);
                if (e.target.checked) {
                  setIsPublic(false);
                }
              }}
            />
            <span className="ml-2">{t("Private")}</span>
          </label>
        </div>
        <div>
          <p className="text-xl font-bold mb-2">{t("Users")} :</p>
          <div className="overflow-y-scroll space-y-2 #text-lg">
            {users?.map((user) => (
              <label key={user._id} className="block">
                <input
                  checked={selectedUsers.includes(user._id)}
                  onChange={(e) => {
                    let set = new Set(selectedUsers);
                    if (e.target.checked) {
                      set.add(user._id);
                    } else {
                      set.has(user._id) && set.delete(user._id);
                    }
                    setIsPublic(false);
                    setIsPrivate(true);
                    setSelectedUsers(Array.from(set));
                  }}
                  type="checkbox"
                  name=""
                  id=""
                />{" "}
                {user.fullName}
              </label>
            ))}
          </div>
        </div>
        <div>
          <button
            className="bg-theme text-theme-text px-2 py-1 rounded-lg mr-4"
            onClick={() => {
              if (isPublic && !isPrivate) {
                changeEditPrivacy(selectedEditPrivacy._id, "public", []);
              } else if (!isPublic && isPrivate) {
                changeEditPrivacy(
                  selectedEditPrivacy._id,
                  "private",
                  selectedUsers
                );
              }
              setShowEditModal(false);
            }}
          >
            {t("Set Privacy")}
          </button>
          <button
            className="bg-theme text-theme-text px-2 py-1 rounded-lg mr-4"
            onClick={() => {
              setShowEditModal(false);
              setSelectedEditPrivacy(null);
            }}
          >
            {t("Close")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default DocumentPage;
