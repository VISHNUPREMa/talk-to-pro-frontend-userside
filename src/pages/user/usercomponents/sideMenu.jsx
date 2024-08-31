import React, { useEffect, useRef } from 'react';
import { X, Home, DollarSign, Bell, CreditCard, Heart, Settings, LogOut, ArrowRight } from 'lucide-react';
import '../../../style/sidemenu.css';
import { useData } from '../../contexts/userDataContext';
import { MdAccountBalance } from "react-icons/md";
import { BACKEND_SERVER } from '../../../secrets/secret.js';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const SideMenu = ({ isOpen, toggleSideMenu }) => {
  const navigate = useNavigate();
  const sideMenuRef = useRef(null);
  const { user, setUser } = useData();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target)) {
        toggleSideMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleSideMenu]);

  const handleItemClick = (content) => {
    switch (content) {
      case 'Service Provider Console':
        navigate('/proconsole');
        break;
      case 'Your Bookings':
        navigate('/booking');
        break;
      case 'Your Transactions':
        navigate('/transaction');
        break;
      case 'Account Details':
        navigate('/accountdetails');
        break;
      case 'Wallet':
        navigate('/wallet');
        break;
      case 'Your Favourites':
        navigate('/favourites');
        break;
      case 'Logout':
        Swal.fire({
          title: 'Are you sure you want to logout?',
          text: 'You will need to log in again to access your account.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, logout!',
        }).then((result) => {
          if (result.isConfirmed) {
            // Clear cookies and local storage
            document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            localStorage.removeItem('refreshToken');
            setUser(null); 
            navigate('/login');
          }
        });
        break;
      default:
        console.log('Unknown menu item');
    }
  };

  return (
    <div ref={sideMenuRef} className={`side-menu ${isOpen ? 'open' : ''}`}>
      <ul className="side-menu-list">
        <li className="side-menu-item" onClick={() => handleItemClick('Your Bookings')}>
          <Home className="menu-icon" /> Your Bookings
        </li>
        <li className="side-menu-item" onClick={() => handleItemClick('Your Transactions')}>
          <DollarSign className="menu-icon" /> Your Transactions
        </li>
        <li className="side-menu-item" onClick={() => handleItemClick('Account Details')}>
          <MdAccountBalance className="menu-icon" size={25} /> Account Details
        </li>
        <li className="side-menu-item" onClick={() => handleItemClick('Wallet')}>
          <CreditCard className="menu-icon" /> Wallet
        </li>
        {user?.isServiceProvider && (
          <li className="side-menu-item" onClick={() => handleItemClick('Service Provider Console')}>
            <ArrowRight className="menu-icon" /> Service Provider Console
          </li>
        )}
        <li className="side-menu-item" onClick={() => handleItemClick('Your Favourites')}>
          <Heart className="menu-icon" /> Your Favourites
        </li>
        <li className="side-menu-item" onClick={() => handleItemClick('Logout')}>
          <LogOut className="menu-icon" /> Logout
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
