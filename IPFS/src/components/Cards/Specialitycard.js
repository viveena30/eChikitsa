import React from 'react'

const Specialitycard = ({src,field,no_of_docs}) => {
  return (
    <>
        
    <div class="speciality-card">
        <div class="speciality-container">
            <div class="icon">
                <img src={src} alt="" />
            </div>
            <div class="speciality-data">
                <div class="speciality-title">
                {field}
                </div>
                <div class="speciality-description">
                {no_of_docs} doctors
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Specialitycard