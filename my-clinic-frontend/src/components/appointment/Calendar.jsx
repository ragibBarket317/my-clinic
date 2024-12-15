import moment from "moment";
import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Calendar.css"; // Import the custom CSS file

const localizer = momentLocalizer(moment);

const Calendar = ({ appointments }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const events = appointments.map((appointment) => ({
    title: appointment.patientName,
    start: new Date(appointment.date),
    end: new Date(appointment.date),
    status: appointment.examName, // Include the status field
    id: appointment.patientId,
  }));

  const handleSelectEvent = (event) => {
    // Navigate to patient details page
    navigate(`/patientDashboard/${event.id}`);
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        borderRadius: "0px",
        opacity: 0.8,
        color: "black",
        border: "0px",
        display: "block",
        backgroundColor: "transparent",
      },
    };
  };

  const EventComponent = ({ event }) => {
    let backgroundColor = "";
    if (event.status === "ACCE") {
      backgroundColor = "#ff0000";
    } else if (event.status === "AWE") {
      backgroundColor = "#254ff9";
    }

    return (
      <div className="custom-event" style={{ backgroundColor }}>
        {event.title}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md w-[100%]">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold mb-4">
          {t("Appointment Calendar")}
        </h2>
        <div className="flex">
          <div className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 bg-[#ff0000] rounded-full mr-2"></span>
            <span>ACCE</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[#254ff9] rounded-full mr-2"></span>
            <span>AWE</span>
          </div>
        </div>
      </div>
      <div className="dark">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600, width: "100%" }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventComponent,
            agenda: {
              event: EventComponent,
            },
            week: {
              event: EventComponent,
              // timeSlotWrapper: () => null,
              eventWrapper: ({ event }) => (
                <div
                  className={`${
                    event.status === "ACCE" ? "bg-[#ff0000]" : "bg-[#254ff9]"
                  } rbc-event-wrapper`}
                  onClick={() => navigate(`/patientDashboard/${event.id}`)}
                  title={`Exam Name: ${event.status}`}
                >
                  {event.title}
                </div>
              ),
            },
            // day: {
            //   event: EventComponent,
            //   timeSlotWrapper: () => null,
            //   eventWrapper: ({ event }) => (
            //     <div className="rbc-event-wrapper" onClick={() => navigate("/")}>
            //       {event.title}
            //     </div>
            //   ),
            // },
          }}
          views={["month", "week"]}
          tooltipAccessor={(event) => `Exam Name: ${event.status}`}
          popup="true"
        />
      </div>
    </div>
  );
};

export default Calendar;
