import React, { useEffect, useState, useContext } from 'react';
import Navbar from './usercomponents/navbar';
import { UserBanner } from './usercomponents/userBanner';
import { CardList } from './usercomponents/userCardList';
import { UserFooter } from './usercomponents/userFooter';
import '../../style/userhome.css';
import axiosInstance from '../../instance/axiosInstance';
import { BACKEND_SERVER } from '../../secrets/secret';
import { useData } from '../contexts/userDataContext';
import CallModal from './usercomponents/callModal';
import { io } from "socket.io-client";
import Swal from 'sweetalert2';
import SearchContext from './context/searchContext';
import { useNavigate } from 'react-router-dom';

const socket = io("http://localhost:3000", { transports: ["websocket"] });

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

function UserHome() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [callData, setCallData] = useState(null);
  const { user } = useData();
  const { searchTerm } = useContext(SearchContext);

  useEffect(() => {
    const userid = user.userid;
    socket.emit('on', { userid });

    socket.on('call-request', (data) => {
      console.log("Received call request:", data);
      setCallData(data); 
      setShowModal(true); 
    });

    return () => {
      socket.off('call-request');
    };
  }, [user]);


  return (
    <>
      <div className='userhome-div'>
        <div className="navbar-fixed">
          <Navbar />
        </div>
        <div className="content" style={{ marginTop: '80px', marginLeft: '0px' }}>
          {searchTerm !== "" ? (
            <div className="horizontal-layout">
              <CardList />
            </div>
          ) : (
          <>
            <UserBanner />
            <div className="horizontal-layout" style={{ marginLeft: '100px' }}>
              <CardList />
            </div>
          
            <div className="footer-fixed">
              <UserFooter />
            </div>
          </>
          )}
        </div>
      </div>
      {showModal && (
        <CallModal callData={callData} onClose={() => setShowModal(true)} />
      )}
    </>
  );
}

export default UserHome;
