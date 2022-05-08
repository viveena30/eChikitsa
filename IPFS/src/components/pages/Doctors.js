import React from "react";
import Specialitycard from "../Cards/Specialitycard";
import Navbar from "../Navbar/Navbar";
import brain from '../../assets/brain.png'
import Docprofile from "../Cards/Docprofile";
import img3 from '../../assets/img3.png';
import 'antd/dist/antd.css';
import { Modal, Button } from 'antd';
import TakeAppointment from "./TakeAppointment";

export default class Doctors extends React.Component {
  state = {
    modal1Visible: false,
    modal2Visible: false,
  };

  setModal1Visible(modal1Visible) {
    this.setState({ modal1Visible });
  }

  setModal2Visible(modal2Visible) {
    this.setState({ modal2Visible });
  }

  render() {
    return (
      <>
        <Navbar />
        <div className="doctors-container">

          <div className="top-bar">
            <div className="section-title">Doctors</div>
          </div>
          <h2>Speciality</h2>
          <section className="speciality">
            <Specialitycard src={brain} field={"Nuerology"} no_of_docs={"2025"} />
            <Specialitycard src={brain} field={"Nuerology"} no_of_docs={"2025"} />
            <Specialitycard src={brain} field={"Nuerology"} no_of_docs={"2025"} />
            <Specialitycard src={brain} field={"Nuerology"} no_of_docs={"2025"} />
            <Specialitycard src={brain} field={"Nuerology"} no_of_docs={"2025"} />
          </section>
          <h2>Doctors</h2>

          <section className="doctors">
            <Docprofile src={img3} no_of_years={"10"} name={"Dr. Yash"} speciality={"Orthopedic"} onClick={() => this.setModal2Visible(true)} />
            <Button onClick={() => this.setModal2Visible(true)}>
              <Docprofile src={img3} no_of_years={"10"} name={"Dr. Yash"} speciality={"Orthopedic"} />
            </Button>
            <Docprofile src={img3} no_of_years={"10"} name={"Dr. Yash"} speciality={"Orthopedic"} />
            <Docprofile src={img3} no_of_years={"10"} name={"Dr. Yash"} speciality={"Orthopedic"} />
            <Docprofile src={img3} no_of_years={"10"} name={"Dr. Yash"} speciality={"Orthopedic"} />
            <Docprofile src={img3} no_of_years={"10"} name={"Dr. Yash"} speciality={"Orthopedic"} />
            <Docprofile src={img3} no_of_years={"10"} name={"Dr. Yash"} speciality={"Orthopedic"} />

            <Modal
              centered
              visible={this.state.modal2Visible}
            >
              <TakeAppointment />
            </Modal>
          </section>
        </div>
      </>
    );
  }
}