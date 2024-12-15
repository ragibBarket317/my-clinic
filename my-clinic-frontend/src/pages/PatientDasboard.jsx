import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ultimateDateFormatter } from "../../utils/ultimateMegaFinalDateFormatter";
import { useStore } from "../Store";
import { Profile } from "../components/Profile";

const PatientDasboard = () => {
  const {
    showEditExaminations,
    showLabs,
    setRisk,
    setStatins,
    setTobaccoUse,
    dm2,
    setDm2,
    setDexa,
    showMedicalHistory,
    setQTR1,
    setQTR1Date,
    setQTR2,
    setQTR2Date,

    setQTR3,

    setQTR3Date,

    setQTR4,

    setQTR4Date,

    setEGRFDate,

    setUACRDate,

    setAweStatus,

    setAweDate,

    setAweCbpSystolic,

    setAweCbpdiastolic,

    setAwePhq2Score,

    setAwePhq2Date,

    setAwePhq9Level,

    setAwePhq9Score,

    setAwePhq9Date,

    setColStatus,

    setColDate,

    setBcsDate,

    setAcceStatus,

    setAcceDate,

    setAcceCbpSystolic,

    setAcceCbpdiastolic,

    setAcceFallRisk,

    setAttestation,

    setHosper,

    setEyeStatus,

    setEyeDate,

    setEyeResults,

    setFootStatus,

    setFootDate,

    setPhqVersion,
    bmi,
    setBmi,
    bmiDate,
    eyeDate,
    setBmiDate,
    setChronicConditions,
  } = useStore();

  const { id } = useParams();

  // console.log("eye", eyeDate);

  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/patient/get-patient/${id}`,
          { withCredentials: true }
        );

        const data = response?.data?.data;
        // console.log("Data", data);
        if (response?.status === 200) {
          // setPatientData(data);
          setRisk(data?.medicalHistories?.risk);
          setStatins(data?.medicalHistories?.statins);
          setTobaccoUse(data?.medicalHistories?.tobaccoUse);
          setDm2(data?.medicalHistories?.dm2);
          setDexa(data?.medicalHistories?.dexa);
          setBmi(data?.medicalHistories?.bmi);
          setBmiDate(data?.medicalHistories?.bmiDate);
          setChronicConditions(data?.medicalHistories?.chronicConditions);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchMedicalData();
  }, []);

  // Fetching and updating store for Lab component

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/patient/get-patient/${id}`,
          { withCredentials: true }
        );

        const data = response?.data?.data;
        // console.log("Data", data);
        // console.log("Labs Data", Object.keys(data).includes("labsDatas"));

        if (
          response?.status === 200 &&
          Object.keys(data).includes("labsDatas") === false
        ) {
          setQTR1(-1);
          setQTR1Date(ultimateDateFormatter(null));
          setQTR2(-1);
          setQTR2Date(ultimateDateFormatter(null));
          setQTR3(-1);
          setQTR3Date(ultimateDateFormatter(null));
          setQTR4(-1);
          setQTR4Date(ultimateDateFormatter(null));
          setEGRFDate(ultimateDateFormatter(null));
          setUACRDate(ultimateDateFormatter(null));
        }
        if (response?.status === 200) {
          setQTR1(data?.labsDatas.QTR1);
          setQTR1Date(ultimateDateFormatter(data?.labsDatas.QTR1Date));
          setQTR2(data?.labsDatas.QTR2 || -1);
          setQTR2Date(ultimateDateFormatter(data?.labsDatas.QTR2Date));
          setQTR3(data?.labsDatas.QTR3 || -1);
          setQTR3Date(ultimateDateFormatter(data?.labsDatas.QTR3Date));
          setQTR4(data?.labsDatas.QTR4 || -1);
          setQTR4Date(ultimateDateFormatter(data?.labsDatas.QTR4Date));
          setEGRFDate(ultimateDateFormatter(data?.labsDatas.eGRFDate));
          setUACRDate(ultimateDateFormatter(data?.labsDatas.uACRDate));
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchLabData();
  }, []);

  // Fetching and updating store for Examination component

  useEffect(() => {
    const fetchExaminationData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/patient/get-patient/${id}`,
          { withCredentials: true }
        );

        const data = response?.data?.data;
        // console.log("Examination", data);

        if (
          response?.status === 200 &&
          Object.keys(data).includes("patientExams") === false
        ) {
          setAweStatus("");
          setAweDate(ultimateDateFormatter(""));
          setAweCbpSystolic(0);
          setAweCbpdiastolic(0);
          setAwePhq2Score(2);
          setAwePhq2Date(ultimateDateFormatter(""));
          setAwePhq9Level("");
          setAwePhq9Score(5);
          setAwePhq9Date(ultimateDateFormatter(""));
          setColStatus("");
          setColDate(ultimateDateFormatter(""));
          setBcsDate(ultimateDateFormatter(""));
          setAcceStatus("");
          setAcceDate(ultimateDateFormatter(""));
          setAcceCbpSystolic(129);
          setAcceCbpdiastolic(76);
          setAcceFallRisk("");
          setAttestation("");
          setHosper("");
          setEyeStatus("");
          setEyeDate(ultimateDateFormatter(""));
          setEyeResults("");
          setFootStatus("");
          setFootDate(ultimateDateFormatter(""));
          setPhqVersion("2");
        }

        if (response?.status === 200) {
          const { patientExams } = data;
          // Set patient examination data

          setAweStatus(patientExams?.aweStatus);
          setAweDate(ultimateDateFormatter(patientExams?.aweDate));
          setAweCbpSystolic(patientExams?.aweCbpSystolic);
          setAweCbpdiastolic(patientExams?.aweCbpdiastolic);
          setAwePhq2Score(patientExams?.awePhq2Score);
          setAwePhq2Date(ultimateDateFormatter(patientExams?.awePhq2Date));
          setAwePhq9Level(patientExams?.awePhq9Level);
          setAwePhq9Score(patientExams?.awePhq9Score);
          setAwePhq9Date(ultimateDateFormatter(patientExams?.awePhq9Date));
          setColStatus(patientExams?.colStatus);
          setColDate(ultimateDateFormatter(patientExams?.colDate));
          setBcsDate(ultimateDateFormatter(patientExams?.bcsDate));
          setAcceStatus(patientExams?.acceStatus);
          setAcceDate(ultimateDateFormatter(patientExams?.acceDate));
          setAcceCbpSystolic(patientExams?.acceCbpSystolic);
          setAcceCbpdiastolic(patientExams?.acceCbpdiastolic);
          setAcceFallRisk(patientExams?.acceFallRisk);
          setAttestation(patientExams?.attestation);
          setHosper(patientExams?.hosper);
          setEyeStatus(patientExams?.eyeStatus);
          setEyeDate(ultimateDateFormatter(patientExams?.eyeDate) || "");
          setEyeResults(patientExams?.eyeResults);
          setFootStatus(patientExams?.footStatus);
          setFootDate(ultimateDateFormatter(patientExams?.footDate) || "");
          setPhqVersion(patientExams?.phqVersion);

          // setDm2(medicalHistories?.dm2);

          // Set gender and age
          // setGender(gender);
          // setPatientsAge(age);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchExaminationData();
  }, []);

  const calculatePatientDashboardHeight = () => {
    if (showEditExaminations && showMedicalHistory && showLabs) {
      return "1500px";
    } else if ((dm2 === "Yes" && showMedicalHistory) || dm2 === "Yes") {
      return "1500px";
    } else {
      return "950px";
    }
  };

  return (
    <div style={{ height: calculatePatientDashboardHeight() }}>
      <Profile id={id}></Profile>
    </div>
  );
};

export default PatientDasboard;
