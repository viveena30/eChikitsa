import React from 'react'

export default function TakeAppointment() {
    return (
        <div className="App take-appointment-container">
            <div className="back">  
                back
            </div>
            <div className="appointment-title">
                New Appointment
            </div>
            <div className="data-container">
                <form action="">
                    <div className="date-container">
                        <div className="item-title">
                            Select Date
                        </div>
                        <div className="item-data">
                            <div className="date">
                                12
                                <p>Mon</p>
                            </div>
                            <div className="date">
                                12
                                <p>Tues</p>
                            </div>
                            <div className="date">
                                12
                                <p>Wed</p>
                            </div>

                        </div>
                    </div>
                    <div className="time-container">
                        <div className="item-title">
                            Available time
                        </div>
                        <div className="item-data">
                            <div className="time">09:00 AM</div>
                            <div className="time">09:00 AM</div>
                            <div className="time">09:00 AM</div>
                            <div className="time">09:00 AM</div>
                        </div>
                    </div>
                    <div className="problem-container">
                        <div className="item-title">
                            Write your problem
                        </div>
                        <div className="item-data">
                            <input type="text" />
                        </div>
                    </div>
                </form>
                <div className="set-appointment">
                    <button>Set Appointment</button>
                </div>
            </div>
        </div>
    )
}




