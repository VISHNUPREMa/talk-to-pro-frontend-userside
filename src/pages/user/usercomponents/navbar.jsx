import React, { useState, useEffect, useContext } from 'react';
import { Menu } from 'lucide-react';
import { IoMenuSharp, IoNotifications } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import '../../../../public/profile.png';
import SearchContext from '../context/searchContext';
import SideMenu from './sideMenu';
import { AuthContext } from './jwtAuthContext';
import { useData } from '../../contexts/userDataContext';
import UserNotification from '../navbar-components/userNotification';
import { FaVideo } from "react-icons/fa6";
import '../../../style/navbar.css';

const Navbar = ({ callData }) => {
  const { user } = useData();
  const username = user?.username;
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile menu

  useEffect(() => {
    const token = localStorage.getItem('refreshToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const goToHome = async (e) => {
    e.preventDefault();
    try {
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleNotification = async (e) => {
    e.preventDefault();
    try {
      setShowNotification(!showNotification);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVideoCall = async (e) => {
    e.preventDefault();
    try {
      navigate("/videocall", { state: { callData } });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="left" onClick={goToHome} style={{ cursor: 'pointer' }}>
          <span className="title" onClick={toggleMobileMenu}>Talk to Pro</span>
        </div>
        {/* Only show the right side if the mobile menu is open or on larger screens */}
        {(isMobileMenuOpen || window.innerWidth > 768) && (
          <div className="right">
            <input
              type="text"
              placeholder="Search for mentors"
              className="search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {callData && <FaVideo size={30} style={{ marginLeft: '25px' }} onClick={handleVideoCall} />}
            {showNotification && <UserNotification />}
            {user && <IoNotifications style={{ fontSize: '24px', marginLeft: '25px', cursor: 'pointer' }} onClick={handleNotification} />}
            {user && (
              <div className="profile-icon">
                <img src="../../../../profile.png" alt="Profile" className="profile-pic" />
              </div>
            )}
            <p>{username ? username : null}</p>
            {!isAuthenticated && (
              <button className="login-btn" onClick={handleLogin}>
                Login
              </button>
            )}
            <div className="menu-icon" onClick={toggleSideMenu}>
              <IoMenuSharp size={40} />
            </div>
          </div>
        )}
      </div>
      <SideMenu isOpen={isSideMenuOpen} toggleSideMenu={toggleSideMenu} />
    </div>
  );
};

export default Navbar;
