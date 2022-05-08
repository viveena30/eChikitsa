import React from 'react'

export default function AddRecord() {
    return (
        <div className="App take-appointment-container .add-records">
            <div className="back">
                back
            </div>
            <div className="appointment-title">
                New Record
            </div>
            <div className="data-container">
                <form action="">
                    <div className="data-list problem-container">
                        <div className="item-title">
                            Subject of Record
                        </div>
                        <div className="item-data">
                            <input type="text" placeholder='Diabetes Record' />
                        </div>
                    </div>
                    <div className="data-list problem-container">
                        <div className="item-title">
                            Date of Disease
                        </div>
                        <div className="item-data">
                            <input type="text" />
                        </div>
                    </div>
                    <div className="problem-container">
                        <div className="item-title">
                            Add File
                        </div>
                        <div className="item-data">
                            <input type="file" id="photo-upload" name="record-photo" placeholder="" accept=".jpg" />
                            <i class="fas fa-upload"></i>
                            <p>Browse File Here</p>
                        </div>
                    </div>
                </form>
                <div className="add-record set-appointment">
                    <button>Add Record</button>
                </div>
            </div>
        </div>
    )
}