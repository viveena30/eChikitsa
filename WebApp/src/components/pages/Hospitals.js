import React from "react";
import Hospitalcard from "../Cards/Hospitalcard";
import Navbar from "../Navbar/Navbar";

const Hospitals = () => {
  const icon = document.querySelector(".icon");
  const search = document.querySelector(".search");

//   icon.onclick = function () {
//     search.classList.toggle("active");
//   };

  return (
    <>
      <Navbar />
      <div className="hospitals-container">
        <div className="top-bar">
          <div className="section-title">Hospitals</div>
          <div class="search">
            <div class="icon"></div>

            <div class="input">
              <input type="text" placeholder="Search..." id="mysearch" />
            </div>

            <span
              class="clear"
              onclick="document.getElementById('mysearch').value = ''"
            ></span>
          </div>
        </div>
        <Hospitalcard name={"Satyam Hospital"} address={"340-342, Third floor, Royal Arcade, Surat - Kamrej Hwy, opposite the zoo"} />
        <Hospitalcard name={"Satyam Hospital"} address={"340-342, Third floor, Royal Arcade, Surat - Kamrej Hwy, opposite the zoo"} />
        <Hospitalcard name={"Satyam Hospital"} address={"340-342, Third floor, Royal Arcade, Surat - Kamrej Hwy, opposite the zoo"} />
        <Hospitalcard name={"Satyam Hospital"} address={"340-342, Third floor, Royal Arcade, Surat - Kamrej Hwy, opposite the zoo"} />
        <Hospitalcard name={"Satyam Hospital"} address={"340-342, Third floor, Royal Arcade, Surat - Kamrej Hwy, opposite the zoo"} />
        <Hospitalcard name={"Satyam Hospital"} address={"340-342, Third floor, Royal Arcade, Surat - Kamrej Hwy, opposite the zoo"} />
        <Hospitalcard name={"Satyam Hospital"} address={"340-342, Third floor, Royal Arcade, Surat - Kamrej Hwy, opposite the zoo"} />
        <Hospitalcard name={"Satyam Hospital"} address={"340-342, Third floor, Royal Arcade, Surat - Kamrej Hwy, opposite the zoo"} />
      </div>
    </>
  );
};

export default Hospitals;
