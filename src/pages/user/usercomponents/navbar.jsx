import React, { useState, useEffect, useContext } from 'react';
import { Menu } from 'lucide-react';
import { IoMenuSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import '../../../../public/profile.png';
import SearchContext from '../context/searchContext';
import SideMenu from './sideMenu';
import { AuthContext } from './jwtAuthContext';
import { useData } from '../../contexts/userDataContext';
import { IoNotifications } from "react-icons/io5";
import UserNotification from '../navbar-components/userNotification';
import { FaVideo } from "react-icons/fa6";
import '../../../style/navbar.css'

const Navbar = ({callData}) => {
  const { setUser: setGlobalUser ,user} = useData();
const username = user.username
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false)

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
  
  const handleLogout = () => {

    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    localStorage.removeItem('refreshToken');
  
    setGlobalUser(null);
     setIsAuthenticated(false);
  
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };


  const goToHome = async(e) =>{
    e.preventDefault()
    try {
      navigate('/')
    } catch (error) {
      
    }
  }


  const handleNotification = async(e) => {
    e.preventDefault();
    try {
      showNotification ? setShowNotification(false) : setShowNotification(true)
    } catch (error) {
      console.log(error);
    }
  }


  const handleVideoCall = async(e)=>{
    e.preventDefault();
    try {
      navigate("/videocall", { state: { callData } }); 
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="navbar">
      <div className="container">
        <div className="left" onClick={goToHome} style={{cursor:'pointer'}}>
          <span className="title">Talk to Pro</span>
        </div>
        <div className="right">
          <input
            type="text"
            placeholder="Search for mentors"
            className="search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {callData &&<FaVideo size={30} style={{marginLeft:'25px'}}  onClick={handleVideoCall} />}
          {showNotification&&<UserNotification/>}
         <IoNotifications style={{ fontSize: '24px', marginLeft: '25px', cursor:'pointer' }} onClick={handleNotification} />
          <div className="profile-icon">
            <img src="../../../../profile.png" alt="Profile" className="profile-pic" />
            
          </div>
          <p>{username}</p>
          {isAuthenticated ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
          )}
          <div className="menu-icon" onClick={toggleSideMenu}>
          <IoMenuSharp size={40} />
          </div>
        </div>
      </div>
      <SideMenu isOpen={isSideMenuOpen} toggleSideMenu={toggleSideMenu} />
    </div>
  );
};

export default Navbar;
