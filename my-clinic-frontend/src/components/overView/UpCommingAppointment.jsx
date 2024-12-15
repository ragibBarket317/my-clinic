import React from "react";
import { formatDateV3 } from "../../../utils/ultimateMegaFinalDateFormatter";

const UpCommingAppointment = ({ appointments }) => {
  return (
    <>
      <div className="bg-white rounded-[20px] shadow-sm dark:bg-[--secondary]">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold mb-4 pt-4 pl-4">
            Upcoming appointment
          </h2>
          <div className="mb-4">
            {/* <select className="w-full p-2 border rounded">
                  <option>May 2024</option>
                </select> */}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-b-[20px] mb-2 dark:bg-[--secondary]">
            <thead className="text-[14px]">
              <tr>
                <th className="py-2 w-[40%] border font-semibold border-l-0">
                  Name
                </th>
                <th className="py-2 border font-semibold">Date</th>
                {/* <th className="py-2 border font-semibold">Time</th> */}
                <th className="py-2 border font-semibold border-r-0">More</th>
              </tr>
            </thead>
            {appointments.map((appointment) => (
              <tbody key={appointment.patientId} className="text-[14px]">
                <tr className=" text-center">
                  <td className="flex  items-center py-2 text-center text-[14px] pl-4">
                    {/* <img
                    src="/avatar.jpg"
                    alt="Julia Neustadt"
                    className="w-[47px] h-[47px] rounded-full mx-4 "
                  /> */}
                    {appointment.patientName}
                  </td>
                  <td className="py-2 border-l">
                    {formatDateV3(appointment.date)}
                  </td>
                  {/* <td className="py-2 border-l">9:00am</td> */}
                  <td className="py-2 border-l">
                    <button className="text-white bg-[#1c55fe] w-[105px] h-[30px] rounded-[30px] text-[13px]">
                      View Details
                    </button>
                  </td>
                </tr>
                {/* <tr className=" text-center">
                <td className="flex  items-center py-2">
                  <img
                    src="/avatar.jpg"
                    alt="Peter Reinhardt"
                    className="w-[47px] h-[47px] rounded-full mx-4"
                  />
                  Peter Reinhardt
                </td>
                <td className="py-2 border-l">April 12, 2024</td>
                <td className="py-2 border-l">10:20am</td>
                <td className="py-2 border-l">
                  <button className="text-white bg-[#1c55fe] w-[105px] h-[30px] rounded-[30px] text-[13px]">
                    View Details
                  </button>
                </td>
              </tr>
              <tr className="text-center">
                <td className="flex  items-center py-2">
                  <img
                    src="/avatar.jpg"
                    alt="Mathias Schwartz"
                    className="w-[47px] h-[47px] rounded-full mx-4"
                  />
                  Mathias Schwartz
                </td>
                <td className="py-2 border-l">April 10, 2024</td>
                <td className="py-2 border-l">11:30am</td>
                <td className="py-2 border-l">
                  <button className="text-white bg-[#1c55fe] w-[105px] h-[30px] rounded-[30px] text-[13px]">
                    View Details
                  </button>
                </td>
              </tr> */}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </>
  );
};

export default UpCommingAppointment;
