import React from "react";
import calendar from "../../assets/calendar.png";
import watch from "../../assets/watch.png";
import sb from "../../assets/sb.png";

const Appointmentcard = ({date, time, desc}) => {
  return (
    <>
      <div class="appointment-card">
        <div class="appointment-card-container">
          <div class="appoint-title">Consultant with Dentist</div>
          <div class="appoint-des">
            <div class="appoint-des-item">
              <img src={calendar} alt="" />
              <p>{date}</p>
            </div>
            <div class="appoint-des-item">
              <img src={watch} alt="" />
              <p>{time}</p>
            </div>
            <div class="appoint-des-item">
              <img src={sb} alt="" />
              <p>{desc}</p>
            </div>
          </div>
          <div class="appoint-cancel">
            <button>Cancel Booking</button>
          </div>
        </div>
      </div>
    </>
    
  );
};

export default Appointmentcard;
