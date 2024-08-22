import React, { useState , useEffect } from 'react';
import { FaPhone, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom'; 
import '../../../style/callmodal.css'
import { io } from "socket.io-client";
import { useData } from '../../contexts/userDataContext';

const socket = io("http://localhost:3000", { transports: ["websocket"] });

const CallModal = ({ callData, onClose }) => {
  const {user} = useData()
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();
 
  useEffect(()=>{
  
    const userid = user.userid
  socket.emit('on',{userid})
  },[])
  

  const closeModal = () => {
    const from = callData.from
    socket.emit('cut-call',{from})
    setIsModalOpen(false);
    onClose(); 
  };


  const handleCallRequest = async (e) => {
    e.preventDefault();
    try {
      navigate("/videocall", { state: { callData } }); 
    } catch (error) {
      console.error("Error navigating to video call:", error);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Call Modal"
      className="call-modal"
      overlayClassName="call-modal-overlay"
      ariaHideApp={false} 
    >
      <div className="call-modal-content">
        <h2 className="modal-title">You have a call</h2>
        <div className="icon-buttons">
          <button className="call-button" onClick={handleCallRequest}>
            <FaPhone className="icon-1" />
          </button>
          <button className="cut-button" onClick={closeModal}>
            <FaTimes className="icon-1" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CallModal;
