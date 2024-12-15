import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { calculateAge } from "../../utils/ageCalculation";
import { useStore } from "../Store";

const AddPatientModal = ({ isOpen, onClose, onHandlePatientInfo }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [gender, setGender] = useState("");
  const [clinic, setClinic] = useState("");
  const [plan, setPlan] = useState("");
  const [benefityear, setBenefityear] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const age = calculateAge(dateOfBirth);

      // const formData = {
      //   firstName,
      //   lastName,
      //   dob: dateOfBirth,
      //   age,
      //   gender,
      //   clinic,
      //   plan,
      //   benefityear,
      // };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/patient/add-patient`,
        {
          firstName,
          lastName,
          dob: dateOfBirth,
          age,
          gender,
          accountNumber,
          clinic,
          plan,
          benefityear,
        },
        { withCredentials: true }
      );

      if (response?.status === 201) {
        // console.log(response);
        onHandlePatientInfo();

        // Reset form fields

        if (response?.data?.data?.gender === "male") {
          const res = await axios.post(
            `${
              import.meta.env.VITE_SERVER_BASE_URL
            }/api/v1/patient/add-medical-history/${response?.data?.data?._id}`,
            {
              dexa: "Not Required",
            },
            { withCredentials: true }
          );
        }

        setFirstName("");
        setLastName("");
        setGender("");
        setClinic("");
        setPlan("");
        setBenefityear("");
        setDateOfBirth("");
        navigate(`/patientDashboard/${response?.data?.data._id}`);
        toast.success("Patient added successfully!", {
          className: "toast-custom",
        });
        onClose();
        // Close the modal

        // setTimeout(() => {
        //   window.location.reload();
        // }, 1500);
      }
    } catch (error) {
      console.error(error);
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.message === "Account number already exists"
      ) {
        toast.error("Account number already exists.", {
          className: "toast-custom",
        });
      } else {
        toast.error("Something went wrong! Please try again.", {
          className: "toast-custom",
        });
      }
    }
  };
  const { auth } = useStore();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 lato text-[16px]">
          <div className="bg-white dark:bg-[--secondary] p-6 rounded-lg w-[45%]">
            <h2 className="text-lg font-semibold mb-4">{t("Add Patient")}</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between">
                <div className="mb-4 w-[48%]">
                  <label htmlFor="name" className="block mb-2">
                    {t("First Name")}:
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="border border-gray-300 px-3 py-2 w-full rounded-md dark:bg-[--secondary]"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4 w-[48%]">
                  <label htmlFor="lastName" className="block mb-2">
                    {t("Last Name")}:
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="border border-gray-300 px-3 py-2 w-full rounded-md dark:bg-[--secondary]"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <div className="mb-4 w-[48%]">
                  <label htmlFor="dob" className="block mb-2">
                    {t("Date Of Birth")}:
                  </label>
                  <input
                    type="date"
                    id="name"
                    className="border border-gray-300 px-3 py-2 w-full rounded-md dark:bg-[--secondary]"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4 w-[48%]">
                  <label htmlFor="gender" className="block mb-2">
                    {t("Gender")}:
                  </label>
                  <select
                    id="gender"
                    className="border border-gray-300 px-3 py-2.5 w-full rounded-md dark:bg-[--secondary]"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">{t("Select Gender")}</option>
                    <option value="male">{t("Male")}</option>
                    <option value="female">{t("Female")}</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">
                  {t("Account Number")}:
                </label>
                <input
                  type="text"
                  id="name"
                  className="border border-gray-300 px-3 py-2 w-full rounded-md dark:bg-[--secondary]"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="plan" className="block mb-2">
                  {t("Clinic")}:
                </label>
                <select
                  id="plan"
                  className="border border-gray-300 px-3 py-2 w-full rounded-md dark:bg-[--secondary]"
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  required
                >
                  <option value="" default disabled>
                    {t("Select Clinic")}
                  </option>
                  <option value="dm">DM</option>
                  <option value="dew">Dew</option>
                  <option value="ww">WW</option>
                  <option value="rb">RB</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="plan" className="block mb-2">
                  {t("Plan")}:
                </label>
                <select
                  id="plan"
                  className="border border-gray-300 px-3 py-2 w-full rounded-md dark:bg-[--secondary]"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  required
                >
                  <option value="" default disabled>
                    Select Plan
                  </option>
                  <option value="self-pay">{t("Self Pay")}</option>
                  <option value="membership">{t("Membership")}</option>
                  <option value="commercial">{t("Commercial")}</option>
                  <option value="medicare-advantage">
                    {t("Medicare-Advantage")}
                  </option>
                  <option value="medicare-traditional">
                    {t("Medicare-Traditional")}
                  </option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="membership" className="block mb-2">
                  {t("Benefit Year")}:
                </label>
                <select
                  id="membership"
                  className="border border-gray-300 px-3 py-2 w-full rounded-md dark:bg-[--secondary]"
                  value={benefityear}
                  onChange={(e) => setBenefityear(e.target.value)}
                  required
                >
                  <option value="" default disabled>
                    {t("Select Benefit Year")}
                  </option>
                  <option value="jan-dec">Jan-Dec</option>
                  <option value="365+1 days">365+1 Days</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={onClose}
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-theme text-theme-text rounded-md hover:bg-theme-hover"
                >
                  {t("Add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPatientModal;
