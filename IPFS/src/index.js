import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/pages/Home';
import Appointments from './components/pages/Appointments';
import Hospitals from './components/pages/Hospitals';
import Records from './components/pages/Records';
import Doctors from './components/pages/Doctors';
import Login from './login-components/Login';
import DoctorSignup from './login-components/DoctorSignup';
import Singup from './login-components/Singup';
import SelectUser from './login-components/SelectUser';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    
    <Router>
      
      <Routes>
        <Route path="/" exact element={<App />} />
        <Route path="/home"  element={<Home/>} />
        <Route path="/appointments"  element={<Appointments/>} />
        <Route path="/hospitals"  element={<Hospitals/>} />
        <Route path="/records"  element={<Records/>} />
        <Route path="/doctors"  element={<Doctors/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctorsignup" element={<DoctorSignup />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/selectuser" element={<SelectUser />} />
        {/* <Route path="/contact" element={<Contact />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="*" component={<ErrorPage />} />
        <Route path='/sign-up' component={SignUp} /> */}
      </Routes>
     
  
    </Router>
  </React.StrictMode>
);
