import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MissedAptModal from "./MissedAptModal";

function OverdueApts({ data }) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [title, setTitle] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null); // Reset modal data when closing the modal
  };

  const handleClick = (patients, title) => {
    setModalData(patients);
    setTitle(title);
    openModal();
  };

  const transformedData =
    data && data.results && data.results.length > 0
      ? Object.entries(data.results[0]).map(([clinic, values]) => ({
          clinic,
          awe: values.aweOverdueCount,
          aweIncomplete: values.aweIncompletePercentage,
          acce: values.acceOverdueCount,
          acceIncomplete: values.acceIncompletePercentage,
          patients: values.patients,
          missedPatientsListACCE: values.missedPatientsListACCE,
          totalClinicPatient: values.patients.concat(
            values.missedPatientsListACCE
          ),
        }))
      : [];

  // console.log("ACCE", transformedData);
  // console.log("MissedApt", data);

  return (
    <div>
      <div>
        <div className="bg-theme text-theme-text py-2 px-2 border-2 border-white dark:border-gray-600 ">
          <h2 className="text-[16px] font-bold">{t("Overdue Appointments")}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border-2 border-white dark:border-gray-600">
            <thead className="bg-gray-300 dark:bg-[--bgcolor]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-[15px] font-bold uppercase tracking-wider border-2 border-white dark:border-gray-600 w-[20%]"
                >
                  {t("Location")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-[15px] font-bold uppercase tracking-wider border-2 border-white dark:border-gray-600 w-[20%]"
                >
                  AWE
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-[15px] font-bold uppercase tracking-wider border-2 border-white dark:border-gray-600 w-[20%]"
                >
                  % {t("Incomplete")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-[15px] font-bold uppercase tracking-wider border-2 border-white dark:border-gray-600 w-[20%]"
                >
                  ACCE
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-[15px] font-bold uppercase tracking-wider border-2 border-white dark:border-gray-600 w-[20%]"
                >
                  % {t("Incomplete")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transformedData.map((row, index) => (
                <tr
                  key={index}
                  className={`cursor-pointer ${
                    index % 2 === 0
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "bg-gray-300 dark:bg-[--bgcolor]"
                  }`}
                >
                  <td
                    onClick={() =>
                      handleClick(
                        row.totalClinicPatient,
                        `All missed ${row.clinic} clinic patient list`
                      )
                    }
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 border-2 border-white dark:border-gray-600 uppercase"
                    title={`${row.clinic} all patients`}
                  >
                    {row.clinic}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-100 border-2 border-white dark:border-gray-600"
                    onClick={() =>
                      handleClick(row.patients, `All missed awe patient list`)
                    }
                  >
                    {row.awe}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-100 border-2 border-white dark:border-gray-600"
                    onClick={() =>
                      handleClick(row.patients, `All missed awe patient list`)
                    }
                  >
                    {row.aweIncomplete}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-100 border-2 border-white dark:border-gray-600"
                    onClick={() =>
                      handleClick(
                        row.missedPatientsListACCE,
                        `All missed acce patient list`
                      )
                    }
                  >
                    {row.acce}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-100 border-2 border-white dark:border-gray-600"
                    onClick={() =>
                      handleClick(
                        row.missedPatientsListACCE,
                        `All missed acce patient list`
                      )
                    }
                  >
                    {row.acceIncomplete}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <MissedAptModal
          isOpen={isModalOpen}
          onClose={closeModal}
          data={modalData}
          title={title}
        />
      </div>
    </div>
  );
}

export default OverdueApts;
