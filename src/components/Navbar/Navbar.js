import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css';
import profile from '../../assets/profile.png'


function Navbar() {

    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        }
        else {
            setButton(true);
        }
    };

    useEffect(() => {
        showButton();
    }, []);

    window.addEventListener('resize', showButton)

    // $("#toggle").click(function () {
    //     $(this).toggleClass("on");
    //     $("#menu").slideToggle();
    //   });


    return (
        <>
            <nav className="navbar">
                <div className="navbar-container2">
                    <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                        <span>e-</span>Chikitsa

                    </Link>
                    <div className="menu-icon" onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className="nav-item">
                            <Link to="/home" className="nav-links" onClick={closeMobileMenu}>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/doctors" className="nav-links" onClick={closeMobileMenu}>
                                Doctors
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/hospitals" className="nav-links" onClick={closeMobileMenu}>
                                Hospitals
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/records" className="nav-links" onClick={closeMobileMenu}>
                                Records
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/appointments" className="nav-links" onClick={closeMobileMenu}>
                                Appointments
                            </Link>
                        </li>

                    </ul>
                    <div className="profile-icon" >
                        <img src={profile} alt="" id="toggle" />
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
