import React, { useEffect, useRef } from 'react';
import { X, Home, DollarSign, Bell, CreditCard, Heart, Settings, LogOut, ArrowRight } from 'lucide-react';
import '../../../style/sidemenu.css';
import { useData } from '../../contexts/userDataContext';
import { MdAccountBalance } from "react-icons/md";

import {BACKEND_SERVER} from '../../../secrets/secret.js'
import { useNavigate } from 'react-router-dom';

const SideMenu = ({ isOpen, toggleSideMenu }) => {
  const navigate = useNavigate()
  const sideMenuRef = useRef(null);
  const { user } = useData();

  useEffect(() => {
    console.log("user: ", user); 

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

  const handleItemClick = async(content) => {
    try {
        if(content === 'Service Provider Console'){
          navigate('/proconsole')
            }else if(content === 'Your Bookings'){
              navigate('/booking')
            }else if (content === 'Your Transactions'){
              navigate('/transaction')
            }else if(content === 'account details'){
             
               navigate('/accountdetails')
            }else if(content === 'Wallet'){
              navigate('/wallet')
            }else if(content === 'Your Favourites'){
              navigate('/favourites')
            }

        } catch (error) {
        console.log(error);
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
        <li className="side-menu-item" onClick={() => handleItemClick('account details')}>
        <MdAccountBalance className="menu-icon" size={25} /> Account Details
        </li>
        <li className="side-menu-item" onClick={() => handleItemClick('Wallet')}>
          <CreditCard className="menu-icon" /> Wallet
        </li>
        {user.isServiceProvider && (
          <li className="side-menu-item" onClick={() => handleItemClick('Service Provider Console')}>
            <ArrowRight className="menu-icon" /> Service Provider Console
          </li>
        )}
        <li className="side-menu-item" onClick={() => handleItemClick('Your Favourites')}>
          <Heart className="menu-icon" /> Your Favourites
        </li>
        <li className="side-menu-item" onClick={() => handleItemClick('Settings')}>
          <Settings className="menu-icon" /> Settings
        </li>
        <li className="side-menu-item" onClick={() => handleItemClick('Logout')}>
          <LogOut className="menu-icon" /> Logout
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
