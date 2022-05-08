import React from 'react'
import calendar from "../../assets/calendar.png";
import { Button } from '../Button/Button';


const Recordcard = ({name,date}) => {
  return (
    <>
        <div className="record-container">
            <div className="report-info">

            <div className="report-name">{name}</div>
            <div className="upload-date">
            <img src={calendar} alt="" />
              <p>{date}</p>
            </div>
            </div>
            <Button buttonSize="btn--medium" buttonStyle="btn--primary" buttonColor="blue" >
                View
            </Button>
        </div>
    </>
  )
}

export default Recordcard