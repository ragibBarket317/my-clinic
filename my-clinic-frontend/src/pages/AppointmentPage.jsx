import axios from "axios";
import React, { useEffect, useState } from "react";
import AppointmentNotifications from "../components/appointment/AppointmentNotifications";
import Calendar from "../components/appointment/Calendar";

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/apts/getappointmentsdata`,
          { withCredentials: true }
        );
        // console.log("APT", response.data.data.appointments);
        if (response.status === 200) {
          setAppointments(response?.data?.data?.appointments);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAppointmentData();
  }, []);

  return (
    <div>
      <div className="container mx-auto mb-10">
        <AppointmentNotifications appointments={appointments} />
        <div>
          <Calendar appointments={appointments} />
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
