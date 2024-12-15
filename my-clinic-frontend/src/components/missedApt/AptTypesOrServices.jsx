/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MissedAptModal from "./MissedAptModal";

function AptTypesOrServices({ data }) {
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
    setModalData(patients, title);
    setTitle(title);
    openModal();
  };

  // Check if data.counts exists and has at least one element
  const transformedData =
    data && data.counts && data.counts.length > 0
      ? Object.entries(data.counts[0]).map(([clinic, values]) => ({
          clinic,
          hosp: values.hosperRequiredASAP,
          attestation: values.attestationRequired,
          eye: values.eyeStatusNeedToScheduleOrRefused,
          foot: values.footStatusNeedToScheduleOrRefused,
          hosperRequiredASAPPatientList: values.hosperRequiredASAPPatientList,
          attestationRequiredPatientList: values.attestationRequiredPatientList,
          eyeStatusPatientList:
            values.eyeStatusNeedToScheduleOrRefusedPatientList,
          footStatusPatientList:
            values.footStatusNeedToScheduleOrRefusedPatientList,
          totalClinicPatient: values.hosperRequiredASAPPatientList
            .concat(values.attestationRequiredPatientList)
            .concat(values.eyeStatusNeedToScheduleOrRefusedPatientList)
            .concat(values.footStatusNeedToScheduleOrRefusedPatientList),
        }))
      : [];

  // console.log("Trans", transformedData);

  return (
    <div className="mt-10">
      <div>
        <div className="bg-theme text-theme-text py-2 px-2 border-2 border-white dark:border-gray-600">
          <h2 className="text-[16px] font-bold">
            {t("Other Appointment Types or Services")}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border-2 border-white dark:border-gray-600">
            <thead className="bg-gray-300 dark:bg-[--bgcolor]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-[15px] font-bold uppercase tracking-wider border-2 border-white dark:border-gray-600 w-[20%]"
                >
                  Clinic
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-[15px] font-bold uppercase tracking-wider border-2 border-white dark:border-gray-600 w-[20%]"
                >
                  Hosp/ER FU
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-[15px] font-bold uppercase tracking-wider border-2 border-white dark:border-gray-600 w-[20%]"
                >
                  Attestation
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-[15px] font-bold uppercase tracking-wider border-2 border-white dark:border-gray-600 w-[20%]"
                >
                  Eye
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-[15px] font-bold uppercase tracking-wider border-2 border-white dark:border-gray-600 w-[20%]"
                >
                  Foot
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transformedData.map((row, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-gray-200 dark:bg-gray-700 "
                      : "bg-gray-300 dark:bg-[--bgcolor]"
                  }
                >
                  <td
                    onClick={() =>
                      handleClick(
                        row.totalClinicPatient,
                        `All missed ${row.clinic} patient list`
                      )
                    }
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 border-2 border-white dark:border-gray-600 uppercase"
                    title={`${row.clinic} all patients`}
                  >
                    {row.clinic}
                  </td>
                  <td
                    onClick={() =>
                      handleClick(
                        row.hosperRequiredASAPPatientList,
                        `All missed Hosp/ER FU appointment patient list`
                      )
                    }
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-100 border-2 border-white dark:border-gray-600 cursor-pointer"
                  >
                    {row.hosp}
                  </td>
                  <td
                    onClick={() =>
                      handleClick(
                        row.attestationRequiredPatientList,
                        `All missed attestation appointment patient list`
                      )
                    }
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-100 border-2 border-white dark:border-gray-600 cursor-pointer"
                  >
                    {row.attestation}
                  </td>

                  <td
                    onClick={() =>
                      handleClick(
                        row.eyeStatusPatientList,
                        `All missed eye appointment patient list`
                      )
                    }
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-100 border-2 border-white dark:border-gray-600 cursor-pointer"
                  >
                    {row.eye}
                  </td>
                  <td
                    onClick={() =>
                      handleClick(
                        row.footStatusPatientList,
                        `All missed foot appointment patient list`
                      )
                    }
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-100 border-2 border-white dark:border-gray-600 cursor-pointer"
                  >
                    {row.foot}
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

export default AptTypesOrServices;
