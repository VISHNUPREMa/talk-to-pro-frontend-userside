import React, { useState } from 'react';
import { Clock, Youtube } from 'lucide-react';

import '../../style/console.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../user/usercomponents/navbar';

const Console = () => {
  const navigate = useNavigate()
  const [selectedMenuItem, setSelectedMenuItem] = useState('DASHBOARD');

  const handleSlotBooking = async (e) => {
    e.preventDefault();
    try {
      navigate("/allocateslot")
      
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div style={{width:'100vw'}}>
    
  <div className="navbar-fixed">
        <Navbar />
      </div>
    <div className="dashboard-console">
      <aside className="sidebar-1-console">
        <ul className="menu-list">
          <li className="menu-item" onClick={() => setSelectedMenuItem('DASHBOARD')}>DASHBOARD</li>
          <li className="menu-item" onClick={() => setSelectedMenuItem('CONTENT')}>CONTENT</li>
          <li className="menu-item" onClick={() => setSelectedMenuItem('ANALYTICS')}>ANALYTICS</li>
          <li className="menu-item" onClick={() => setSelectedMenuItem('REVIEWS')}>REVIEWS</li>
        </ul>
      </aside>
      <main className="main-content-console">
        {selectedMenuItem === 'DASHBOARD' && (
          <>
            <div className="profile-analytics">
              <div className="allow-slot-1">
                <Clock size={48} />
                <p>Allow your available time</p>
                <button className="allow-slot-button" onClick={handleSlotBooking}>ALLOW SLOT</button>
              </div>
              <div className="analytics-summary">
                <h2>PROFILE ANALYTICS</h2>
                <p>Current Subscribers: <span>150</span></p>
                <p>Summary (Last 28 days)</p>
                <p>Slots: <span>45</span></p>
                <p>Hours: <span>60.30</span></p>
              </div>
            </div>
            {/* <div className="provider-insider">
              <h2>PROVIDER INSIDER</h2>
              <div className="insider-content">
                <Youtube size={48} />
                <p>Here is the detail demo of how to use "Talk to Pro" as a service provider and earn money...</p>
              </div>
            </div> */}
          </>
        )}
        {selectedMenuItem === 'CONTENT' && <div>Content Section</div>}
        {selectedMenuItem === 'ANALYTICS' && <div>Analytics Section</div>}
        {selectedMenuItem === 'REVIEWS' && <div>Reviews Section</div>}
      </main>
    </div>
    </div>
  );
};

export default Console;

