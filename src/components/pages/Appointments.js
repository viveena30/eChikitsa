import React from "react";
import Appointmentcard from "../Cards/Appointmentcard";
import Navbar from "../Navbar/Navbar";

const Appointments = () => {
  return (
    <>
      <Navbar />
      <div className="appointment-container">
        <div className="section-title">Appointments</div>
        <div className="app-card-container">
            <Appointmentcard date={"12 may 2022"} time={"12:00 PM"} desc={"meri da yi aa yi aa yi aa yi aa yi aa yi aa dard hein"} />
            <Appointmentcard date={"12 may 2022"} time={"12:00 PM"} desc={"meri da yi aa yi aa yi aa yi aa yi aa yi aa dard hein"} />
            <Appointmentcard date={"12 may 2022"} time={"12:00 PM"} desc={"meri da yi aa yi aa yi aa yi aa yi aa yi aa dard hein"} />
            <Appointmentcard date={"12 may 2022"} time={"12:00 PM"} desc={"meri da yi aa yi aa yi aa yi aa yi aa yi aa dard hein"} />
            <Appointmentcard date={"12 may 2022"} time={"12:00 PM"} desc={"meri da yi aa yi aa yi aa yi aa yi aa yi aa dard hein"} />
            <Appointmentcard date={"12 may 2022"} time={"12:00 PM"} desc={"meri da yi aa yi aa yi aa yi aa yi aa yi aa dard hein"} />
           
        </div>
      </div>
    </>
  );
};

export default Appointments;
