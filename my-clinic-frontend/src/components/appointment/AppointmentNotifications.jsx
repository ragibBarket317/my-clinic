import { useEffect } from "react";
import { toast } from "react-toastify";

const AppointmentNotifications = ({ appointments }) => {
  useEffect(() => {
    const upcomingAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const now = new Date();
      const timeDifference = appointmentDate - now;

      return timeDifference > 0 && timeDifference < 24 * 60 * 60 * 1000; // 24 hours
    });

    if (upcomingAppointments.length > 0) {
      const appointmentMessages = upcomingAppointments.map((appointment) => (
        <li key={appointment.id} className="mb-1">
          Appointment with {appointment.patientName} on{" "}
          {new Date(appointment.date).toLocaleString()}
        </li>
      ));

      toast(
        <div>
          <p>You have {upcomingAppointments.length} upcoming appointment(s):</p>
          <ul className="list-disc pl-5">{appointmentMessages}</ul>
        </div>,
        { icon: false }
      );
    }
  }, [appointments]);

  return null;
};

export default AppointmentNotifications;
