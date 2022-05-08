import React from 'react';
import Doctor from "../doctor.png";
import Patient from "../patient.png";
import "./styles.css";

export default function index() {
    return (
        <div className="select-user-container">
            <div className="header-container">
                <div className="logo-container">
                    <p className="title"><span>e-</span>Chikitsa</p>
                </div>
            </div>
            <div className="title-container">
                <div className="user-opi">
                    How are you planning to use <span> e-</span>Chikitsa?
                </div>
                <p>We’ll organize your setup experience accordingly.</p>
            </div>
            <div className="user-container">
                    <div type="button" className="doctor-card user-type-card">
                        <input type="radio" name="usertype" id="" />
                        <label for="radio"></label>
                        <div className="user-type">
                            <img src={Doctor} alt="" />
                            <p>As a Doctor</p>
                        </div>
                    </div>
                    <div type="button" className="patient-card user-type-card">
                        <input type="radio" name="usertype" id="" />
                        <label for="radio"></label>
                        <div className="user-type">
                            <img src={Patient} alt="" />
                            <p>As a Patient</p>
                        </div>
                    </div>
            </div>

            <div className="continue-btn">
                <button>Continue</button>
            </div>


        </div>
    )
}
