// src/components/UpcomingAppointments.js
import React from "react";

const UpcomingAppointments = ({ appointments }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id} className="mb-2">
            <div className="flex justify-between items-center">
              <span>{appointment.patientName}</span>
              <span>{new Date(appointment.date).toLocaleString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingAppointments;
