import React from "react";
import "../../App.css";

const Stepcard = ({ src, title, desc }) => {
  return (
    <>
      <div class="service-card">
        <div class="service-card-container">
          <div class="icon-container">
            <img src={src} alt="" />
          </div>
          <div class="card-title">{title}</div>
          <div class="card-des">{desc}</div>
        </div>
      </div>
    </>
  );
};

export default Stepcard;
