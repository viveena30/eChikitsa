import React from "react";
import calendar from "../../assets/calendar.png";
import watch from "../../assets/watch.png";
import sb from "../../assets/sb.png";
import { Button } from "../Button/Button";

const Hospitalcard = ({name,address}) => {
  return (
    <>
      <div class="hospital-card">
         <div className="hosp-name">{name}</div>
         <div className="hosp-address">{address}</div>
      </div>
    </>
    
  );
};

export default Hospitalcard;
