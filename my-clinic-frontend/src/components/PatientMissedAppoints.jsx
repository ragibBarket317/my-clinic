import axios from "axios";
import ExcelJS from "exceljs";
import { useEffect, useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { formatDateV3 } from "../../utils/ultimateMegaFinalDateFormatter";

const PatientMissedAppoints = ({ isOpen, onClose }) => {
  const [appointData, setAppointData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/patient/missed-apts`,
          { withCredentials: true }
        );
        // console.log("Res:", response?.data?.data?.missedApts);

        if (response?.status === 200) {
          setAppointData(response?.data?.data?.missedApts);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointData();
  }, []);

  const handleRefreshBtn = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/patient/missed-apts-update-manually`,
        { withCredentials: true }
      );
      // console.log("Res:", response?.data?.data?.missedApts);

      if (response?.status === 200) {
        setAppointData(response?.data?.data?.missedApts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoute = (id) => {
    navigate(`/patientDashboard/${id}`);
    onClose();
  };

  // console.log("pa", appointData);

  const handleDownload = async () => {
    try {
      if (!appointData || appointData.length === 0) {
        console.error("No patient data available for download.");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Missed-Appointment");

      // Add header row
      const headerRow = [
        "FULL NAME",
        "DOB",
        "CLINIC",
        "Appointment For",
        "Appointment Due Date",
      ];
      worksheet.addRow(headerRow.map((header) => header.toUpperCase()));

      // Add data rows
      appointData?.forEach((patient) => {
        const formattedDob = formatDateV3(patient.dob);
        const appointmentDueDate = formatDateV3(patient.appointmentDueDate);

        const userDataRow = [
          patient?.patientName?.toUpperCase() || "",
          formattedDob || "",
          patient?.clinic?.toUpperCase() || "",
          patient?.appointmentFor?.toUpperCase() || "",
          appointmentDueDate || "",
        ];
        worksheet.addRow(userDataRow);
      });

      const headerRowNumber = 1;
      const headerCell = worksheet.getRow(headerRowNumber);

      // Check if the row exists, otherwise create it
      if (!headerCell.hasValues) {
        headerCell.getCell(1).value = "FULL NAME";
        headerCell.getCell(2).value = "DOB";
        headerCell.getCell(3).value = "CLINIC";
        headerCell.getCell(4).value = "APPOINTMENT FOR";
        headerCell.getCell(5).value = "APPOINTMENT DUE DATE";
      }

      headerCell.eachCell((cell, colNumber) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "000000" }, // Black background color
        };
        cell.font = {
          color: { argb: "FFFFFF" }, // White text color
          bold: true,
        };
      });

      // Center-align all text in the worksheet
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center" }; // Center-align text
        });
      });

      // Adjust column widths
      worksheet.columns.forEach((column) => {
        column.width = 20; // Set the width of each column to 20
      });

      // Make "HF Account" column bold
      // const hfAccountColumn = worksheet.getColumn("C");
      // hfAccountColumn.eachCell((cell, rowNumber) => {
      //   if (rowNumber !== 1) {
      //     // Skip the header row
      //     cell.font = {
      //       bold: true,
      //     };
      //   }
      // });

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();

      // Create a Blob from the binary data
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Missed-Appointment.xlsx";
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating Excel file:", error);
      // Handle error (e.g., display error message to the user)
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center h-screen px-4">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-800 opacity-75"></div>
            </div>

            <div className="relative bg-white rounded-[20px] shadow-sm dark:bg-[--secondary] w-[60%] p-8">
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={onClose}
                  className="text-gray-700 dark:text-gray-200"
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
              <div className="flex justify-between items-center py-6">
                <div className="text-2xl font-bold">
                  The Following Patients May Be Due For An Appointment
                </div>
                <div className="text-2xl font-bold flex justify-between gap-4">
                  <div>
                    <button
                      onClick={handleRefreshBtn}
                      className="bg-slate-300 dark:bg-slate-600 rounded-full p-2"
                      title="Refresh List"
                    >
                      <MdOutlineRefresh />
                    </button>
                  </div>
                  <div>
                    <button
                      className={`rounded-md p-2 px-4 text-[14px] font-bold text-white transition-all ${
                        appointData.length > 0
                          ? "bg-blue-600 hover:opacity-90"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      onClick={appointData.length > 0 ? handleDownload : ""}
                      disabled={appointData.length === 0}
                    >
                      Download Excel
                    </button>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-[85px] w-[85px] mr-3"
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
              ) : (
                <div className="overflow-y-auto max-h-96 relative">
                  <table className="w-full">
                    <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0 z-10">
                      <tr>
                        <th className="py-4 text-left pl-4">Patient Name</th>
                        <th className="py-4">DOB</th>
                        <th className="py-4">Clinic</th>
                        <th className="py-4">Appointment For</th>
                        <th className="py-4">Appointment Due Date</th>
                      </tr>
                    </thead>

                    {appointData?.map((patient, index) => (
                      <tbody
                        key={patient._id}
                        onClick={() => handleRoute(patient.patientId)}
                        className={`bg-slate-100 dark:bg-slate-500 divide-y divide-gray-800 border-b-8 border-white dark:border-b-[--secondary]  ${
                          index !== 0 ? "mt-4" : ""
                        }`}
                      >
                        <tr className="h-14">
                          <td className="py-4 text-left pl-4 capitalize">
                            {patient.patientName}
                          </td>
                          <td className="py-4 text-center">
                            {formatDateV3(patient.dob)}
                          </td>
                          <td className="py-4 text-center">{patient.clinic}</td>
                          <td className="py-4 text-center">
                            {patient.appointmentFor}
                          </td>
                          <td className="py-4 text-center">
                            {formatDateV3(patient.appointmentDueDate)}
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientMissedAppoints;
