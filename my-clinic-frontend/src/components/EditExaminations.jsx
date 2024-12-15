import React from "react";
import { useStore } from "../Store";

const EditExaminations = () => {
  const {
    gender,
    patientsAge,
    aweStatus,
    aweDate,
    aweCbpSystolic,
    aweCbpdiastolic,
    awePhq2Level,
    awePhq2Score,
    awePhq2Date,
    awePhq9Level,
    awePhq9Score,
    awePhq9Date,
    colStatus,
    colDate,
    bcsDate,
    acceStatus,
    acceDate,
    acceCbpSystolic,
    acceCbpdiastolic,
    acceFallRisk,
    attestation,
    hosper,
    eyeStatus,
    eyeDate,
    eyeResults,
    footStatus,
    footDate,
    setAweStatus,
    setAweDate,
    setAweCbpSystolic,
    setAweCbpdiastolic,
    setAwePhq2Score,
    updatePhq9Level,
    setAwePhq9Score,
    setAwePhq2Date,
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
    phqVersion,
    setPhqVersion,
    setAwePhq9Date,
    dm2,
  } = useStore();

  return (
    <div className="flex items-start justify-start gap-4">
      <div className="awe w-[30%] space-y-2 text-[14px]">
        <h3 className="bg-[#2062B1] text-white px-2 text-sm mb-4">AWE</h3>
        <p>
          Status :{" "}
          <select
            className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
            value={aweStatus}
            onChange={(e) => setAweStatus(e.target.value)}
          >
            <option value="" disabled selected>
              Select Option
            </option>
            <option value="Need to Schedule">Need to Schedule</option>
            <option value="Refused">Refused</option>
            <option value="Scheduled">Scheduled</option>
          </select>
        </p>
        <p>
          Date :{" "}
          {aweStatus === "Scheduled" ? (
            <input
              className="dark:bg-[--secondary]"
              required
              onChange={(e) => {
                if (e.target.value) {
                  setAweDate(e.target.value);
                } else {
                  setAweDate("");
                }
              }}
              value={aweDate}
              type="date"
              name=""
              id=""
            />
          ) : null}
        </p>
        {aweStatus === "Scheduled" ? (
          <>
            <p>
              <span className="text-slate-900 dark:text-white rounded-md font-semibold text-[14px] underline underline-offset-2">
                CBP
              </span>
            </p>
            <p>
              Systolic :{" "}
              <input
                className="custom-input dark:bg-[--secondary]"
                type="number"
                value={aweCbpSystolic === -1 ? "" : aweCbpSystolic}
                onChange={(e) => setAweCbpSystolic(parseInt(e.target.value))}
              />
            </p>
            <p>
              Diastolic :{" "}
              <input
                className="custom-input dark:bg-[--secondary]"
                type="number"
                value={aweCbpdiastolic === -1 ? "" : aweCbpdiastolic}
                onChange={(e) => setAweCbpdiastolic(parseInt(e.target.value))}
              />
            </p>
          </>
        ) : null}
        <p>
          <span className="text-slate-900 dark:text-white rounded-md font-semibold text-[14px] underline underline-offset-2 ">
            PHQ{" "}
            <select
              className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
              value={phqVersion}
              onChange={(e) => setPhqVersion(e.target.value)}
            >
              <option value="" disabled selected>
                version
              </option>
              <option value="2">2</option>
              <option value="9">9</option>
            </select>
          </span>
        </p>

        {phqVersion === "2" ? (
          <>
            <p>
              Score :{" "}
              <input
                className="custom-input dark:bg-[--secondary]"
                type="number"
                min="0"
                max="27"
                value={awePhq2Score === -1 ? "" : awePhq2Score}
                onChange={(e) => setAwePhq2Score(parseInt(e.target.value))}
              />
            </p>

            <p>
              Date :{" "}
              <input
                className="dark:bg-[--secondary]"
                onChange={(e) => {
                  setAwePhq2Date(e.target.value);
                }}
                value={awePhq2Date}
                type="date"
                name=""
                id=""
              />
            </p>
          </>
        ) : (
          <>
            <p>
              Score :{" "}
              <input
                className="custom-input dark:bg-[--secondary]"
                type="number"
                min="0"
                max="27"
                value={awePhq9Score === -1 ? "" : awePhq9Score}
                onChange={(e) => {
                  setAwePhq9Score(parseInt(e.target.value));
                  updatePhq9Level(e.target.value);
                }}
              />
            </p>
            <p>Level : {awePhq9Level === "none" ? "" : awePhq9Level}</p>
            <p>
              Date :{" "}
              <input
                className="dark:bg-[--secondary]"
                onChange={(e) => {
                  if (e.target.value) {
                    setAwePhq9Date(e.target.value);
                  } else {
                    setAwePhq9Date(""); // Reset the date to empty string if invalid
                  }
                }}
                value={awePhq9Date}
                type="date"
                name=""
                id=""
              />
            </p>
          </>
        )}
        {aweStatus === "Scheduled" &&
          patientsAge >= 45 &&
          patientsAge <= 75 && (
            <>
              <p>
                <span className="text-slate-900 rounded-md font-semibold text-[14px] underline underline-offset-2">
                  COL
                </span>
              </p>
              <p>
                Status :{" "}
                <select
                  className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                  value={colStatus === "none" ? "" : colStatus}
                  onChange={(e) => setColStatus(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select Option
                  </option>
                  <option value="Pending">Pending</option>
                  <option value="Refused">Refused</option>
                  <option value="Negative">Negative</option>
                  <option value="Positive">Positive</option>
                </select>
              </p>
              {colStatus != "Refused" && (
                <p>
                  Date :{" "}
                  <input
                    className="dark:bg-[--secondary]"
                    onChange={(e) => {
                      if (e.target.value) {
                        setColDate(e.target.value);
                      } else {
                        setColDate(""); // Reset the date to empty string if invalid
                      }
                    }}
                    value={colDate}
                    type="date"
                    name=""
                    id=""
                  />
                </p>
              )}
            </>
          )}

        {gender == "Female" &&
          aweStatus === "Scheduled" &&
          patientsAge >= 50 &&
          patientsAge <= 74 && (
            <>
              <p>
                <span className="text-slate-900 rounded-md font-semibold text-[14px] underline underline-offset-2">
                  BCS
                </span>
              </p>
              <p>
                Date :{" "}
                <input
                  className="dark:bg-[--secondary]"
                  required
                  onChange={(e) => {
                    if (e.target.value) {
                      setBcsDate(e.target.value);
                    } else {
                      setBcsDate(""); // Reset the date to empty string if invalid
                    }
                  }}
                  value={bcsDate}
                  type="date"
                  name=""
                  id=""
                />
              </p>
            </>
          )}
        <hr />
      </div>
      {(dm2 === "Yes" || dm2 === "PreDM2" || patientsAge >= 50) && (
        <div className="acce w-[30%] ">
          <div className="space-y-2 text-[14px]">
            <h3 className="bg-[#2062B1] text-white px-2 text-sm mb-4">ACCE</h3>
            <p>
              Status :{" "}
              <select
                className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                value={acceStatus}
                onChange={(e) => setAcceStatus(e.target.value)}
              >
                <option value="" disabled selected>
                  Select Option
                </option>
                <option value="Need to Schedule">Need to Schedule</option>
                <option value="Refused">Refused</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </p>
            {acceStatus === "Completed" || acceStatus === "Scheduled" ? (
              <p>
                Date :{" "}
                <input
                  className="dark:bg-[--secondary]"
                  onChange={(e) => {
                    if (e.target.value) {
                      setAcceDate(e.target.value);
                    } else {
                      setAcceDate(""); // Reset the date to empty string if invalid
                    }
                  }}
                  value={acceDate}
                  type="date"
                  name=""
                  id=""
                />
              </p>
            ) : (
              <></>
            )}

            <hr />
            {acceStatus == "Scheduled" ? (
              <>
                <p>
                  <span className="text-slate-900 rounded-md font-semibold text-[14px] underline underline-offset-2">
                    CBP
                  </span>
                </p>
                <p>
                  Systolic :{" "}
                  <input
                    className="custom-input dark:bg-[--secondary]"
                    type="number"
                    value={acceCbpSystolic === -1 ? "" : acceCbpSystolic}
                    onChange={(e) =>
                      setAcceCbpSystolic(parseInt(e.target.value))
                    }
                  />
                </p>
                <p>
                  Diastolic :{" "}
                  <input
                    className="custom-input dark:bg-[--secondary]"
                    type="number"
                    value={acceCbpdiastolic === -1 ? "" : acceCbpdiastolic}
                    onChange={(e) =>
                      setAcceCbpdiastolic(parseInt(e.target.value))
                    }
                  />
                </p>
                <hr />
              </>
            ) : (
              <></>
            )}
            {patientsAge >= 65 && (
              <>
                <p>
                  Fall Risk :{" "}
                  <select
                    className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                    value={acceFallRisk}
                    onChange={(e) => setAcceFallRisk(e.target.value)}
                  >
                    <option value="" disabled selected>
                      Select Option
                    </option>
                    <option value="≤1">≤1</option>
                    <option value="≥2">≥2</option>
                  </select>
                </p>
              </>
            )}
          </div>
        </div>
      )}
      <div className="awe w-[30%]">
        {dm2 === "Yes" && (
          <div className=" space-y-2 text-[14px]">
            <h3 className="bg-[#2062B1] text-white px-2 text-sm mb-4">EYE</h3>
            <p>
              Status :{" "}
              <select
                className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                value={eyeStatus}
                onChange={(e) => setEyeStatus(e.target.value)}
              >
                <option value="" disabled selected>
                  Select Option
                </option>
                <option value="Need to Schedule">Need to Schedule</option>
                <option value="Refused">Refused</option>
                <option value="Scheduled">Scheduled</option>

                <option value="Not Applicable">Not Applicable</option>
              </select>
            </p>
            <p>
              Date :{" "}
              {(eyeStatus === "Scheduled" || eyeStatus === "Completed") && (
                <input
                  className="dark:bg-[--secondary]"
                  onChange={(e) => {
                    if (e.target.value) {
                      setEyeDate(e.target.value);
                    } else {
                      setEyeDate(""); // Reset the date to empty string if invalid
                    }
                  }}
                  value={eyeDate}
                  type="date"
                  name=""
                  id=""
                />
              )}
            </p>
            <p>
              Results :
              {eyeStatus === "Scheduled" && (
                <select
                  className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                  value={eyeResults}
                  onChange={(e) => setEyeResults(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select Option
                  </option>
                  <option value="with retinopathy">with retinopathy</option>
                  <option value="w/o retinopathy">w/o retinopathy</option>
                </select>
              )}
            </p>
            <h3 className="bg-[#2062B1] text-white px-2 text-sm mb-4">Foot</h3>
            <p>
              Status :{" "}
              <select
                className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
                value={footStatus}
                onChange={(e) => setFootStatus(e.target.value)}
              >
                <option value="" disabled selected>
                  Select Option
                </option>
                <option value="Need to Schedule">Need to Schedule</option>
                <option value="Refused">Refused</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </p>
            <p>
              Date :{" "}
              {footStatus === "Scheduled" || footStatus === "Completed" ? (
                <input
                  className="dark:bg-[--secondary]"
                  onChange={(e) => {
                    if (e.target.value) {
                      setFootDate(e.target.value);
                    } else {
                      setFootDate(""); // Reset the date to empty string if invalid
                    }
                  }}
                  value={footDate}
                  type="date"
                  name=""
                  id=""
                />
              ) : (
                <></>
              )}
            </p>
          </div>
        )}
        <div className="mt-10 space-y-4 text-[14px]">
          <p>
            Attestation :{" "}
            <select
              className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
              value={attestation}
              onChange={(e) => setAttestation(e.target.value)}
            >
              <option value="" disabled selected>
                Select Option
              </option>
              <option value="Required">Required</option>
              <option value="Not Needed">Not Needed</option>
            </select>
          </p>
          <p>
            HOSP/ER FU :{" "}
            <select
              className="border outline-none py-1 px-2 rounded dark:bg-[--secondary]"
              value={hosper}
              onChange={(e) => setHosper(e.target.value)}
            >
              <option value="" disabled selected>
                Select Option
              </option>
              <option value="Required ASAP">Required ASAP</option>
              <option value="Not Needed">Not Needed</option>
            </select>
          </p>{" "}
          <hr />
        </div>
      </div>
    </div>
  );
};

export default EditExaminations;
