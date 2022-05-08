import "./App.css";
import { Button } from "./components/Button/Button";
import Footer from "./components/Footer";
import { Link } from "react-router-dom";
import doctorprofile from "./assets/doctorprofile.png";
import herodoc from "./assets/herodoc.png";
import ellipse from "./assets/ellipse.png";
import tick from "./assets/tick.png";
import img1 from "./assets/img1.png";
import img2 from "./assets/img2.png";
import cir from "./assets/cir.png";
import search from './assets/search.png';

import Stepcard from "./components/Cards/Stepcard";

function App() {
  return (
    <>
      {/* navbar */}

      <nav class="navbar">
        <div class="navbar-container container">
          <input type="checkbox" name="" id="" />
          <div class="hamburger-lines">
            <span class="line line1"></span>
            <span class="line line2"></span>
            <span class="line line3"></span>
          </div>
          <ul class="menu-items">

            <Link to="/Login">
              <li>
                <a href="/Login">Login</a>
              </li>
            </Link>
            {/* <Link to="/login">
              <a href="/login">Login</a>
            </Link> */}
          </ul>
          <h1 class="logo">
            <span>e-</span>Chikitsa
          </h1>
        </div>
      </nav>

      {/* hero  */}

      <div className="hero-container">
        <div className="info-container">
          <h2>
            Medical Care Now Simplified For <span>Everyone</span>
          </h2>
          <p>
            Health carely is a new way to get health insurance quotes. We offer
            tools similar to those provided by insurance companies for free and
            prices are based on donations and not restrictive health plan
            networks.
          </p>

          <a href="/login">Login</a>
        </div>
        <div className="img-container">
          <img src={doctorprofile} alt="" className="doc-card" />
          <img src={herodoc} alt="" className="herodoc" />
          <img src={ellipse} alt="" className="ellipse" />
        </div>
      </div>

      {/* make schedule section */}

      <div className="make-schedule-container">
        <div className="schedule-img-container">
          <img src={cir} alt="" className="bg-circle" />
          <img src={img1} alt="" className="main-img" />
        </div>
        <div className="schedule-info-container">
          <small>Make a Schedule</small>
          <h3>Make a schedule in advance with the available doctor</h3>
          <p>
            Healthcare is a very painful process, especially if you're not
            taking care of your health and having regular check-ups.
            HealhtyCarely makes it easier for everyone to schedule a doctor’s
            appointment.
          </p>
          <ul>
            <li>
              <img src={tick} alt="" />
              <h4>Make a schedule online is easy</h4>
            </li>
            <li>
              <img src={tick} alt="" />
              <h4>Easy to connect with doctor</h4>
            </li>
          </ul>
          <Button
            buttonSize="btn--large"
            buttonStyle="btn--primary"
            buttonColor="blue"
          >
            Make Schedule Now!
          </Button>
        </div>
      </div>

      {/* steps container */}

      <div className="steps-container">
        <small>Fast Solutions</small>
        <h2> get your solutions step by step</h2>
        <div className="steps-card-container">

          <Stepcard src={search} title={"Check Health Complaints"} desc={" Check the disease so you can easily choose the right specialist"} />
          <Stepcard src={search} title={"Check Health Complaints"} desc={" Check the disease so you can easily choose the right specialist"} />
          <Stepcard src={search} title={"Check Health Complaints"} desc={" Check the disease so you can easily choose the right specialist"} />
          <Stepcard src={search} title={"Check Health Complaints"} desc={" Check the disease so you can easily choose the right specialist"} />


        </div>






      </div>

      {/* connect section */}

      <div className="connect-container">
        <div className="connect-info-container">
          <h2>Fasilitas Mewah yang manusia</h2>
          <p>
            Rumah sakit adalah bagian integral dari suatu organisasi sosial dan
            kesehatan dengan fungsi menyediakan pelayanan paripurna
            Rumah sakit adalah bagian integral dari suatu organisasi sosial dan
            kesehatan dengan fungsi menyediakan pelayanan paripurna
            (komprehensif).
          </p>
          <Button
            buttonSize="btn--wide"
            buttonStyle="btn--primary"
            buttonColor="blue"
          >
            Connect
          </Button>
        </div>
        <div className="connect-img-container">
          <img src={img2} alt="" />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
