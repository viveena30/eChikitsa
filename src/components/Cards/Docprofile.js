import React from 'react'
import img3 from '../../assets/img3.png'

const Docprofile = ({src, no_of_years, name, speciality}) => {
  return (
    <>
            <div class="doctor-card">
        <div class="doctor-data-container">
            <div class="doctor-pic">
                <img src={src} alt="" />
            </div>
            <div class="doctor-data">
                <div class="doctor-experience">
                    <span> {no_of_years} years </span> of Experience
                </div>
                <div class="doctor-name">
                    {name}
                </div>
                <div class="doctor-speciality">
                    {speciality}
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Docprofile