import React from "react";
import Recordcard from "../Cards/Recordcard";
import Navbar from "../Navbar/Navbar";
import plus from "../../assets/plus.png";
import 'antd/dist/antd.css';
import { Modal, Button } from 'antd';
import AddRecord from './AddRecord';

export default class Records extends React.Component {
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
        <div className="records-container">
          <div className="top-bar">
            <div className="section-title">Health records</div>
            <div className="add-record-btn" onClick={null}>
              <Button onClick={() => this.setModal2Visible(true)}>
                <img src={plus} alt="" />
              </Button>
            </div>
          </div>
          <Modal
            centered
            visible={this.state.modal2Visible}
          >
            <AddRecord />
          </Modal>
          <div className="records-list">

            <Recordcard name={"Diabetes report"} date={"1 May 2022"} />
            <Recordcard name={"Diabetes report"} date={"1 May 2022"} />
            <Recordcard name={"Diabetes report"} date={"1 May 2022"} />
            <Recordcard name={"Diabetes report"} date={"1 May 2022"} />
            <Recordcard name={"Diabetes report"} date={"1 May 2022"} />
            <Recordcard name={"Diabetes report"} date={"1 May 2022"} />
            <Recordcard name={"Diabetes report"} date={"1 May 2022"} />

          </div>
        </div>
      </>
    );
  }
}