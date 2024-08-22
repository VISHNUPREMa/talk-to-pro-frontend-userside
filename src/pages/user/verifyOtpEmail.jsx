import React, { useState } from 'react';
import '../../style/verifyOtpEmail.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { BACKEND_SERVER } from '../../secrets/secret.js';
import 'react-toastify/dist/ReactToastify.css';
import { useEmail } from '../contexts/userEmailContext';
import axiosInstance from '../../instance/axiosInstance';

function VerifyOtpEmail() {
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const { email } = useEmail();

  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) {
      return; 
    }

    const newInputs = [...otpInputs];
    newInputs[index] = value;
    setOtpInputs(newInputs);

    if (value && index < 5) {
      const nextIndex = index + 1;
      const nextInput = document.getElementById(`otp-input-${nextIndex}`);
      if (nextInput) {
        nextInput.removeAttribute('disabled');
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && index > 0 && !otpInputs[index]) {
      const prevIndex = index - 1;
      const prevInput = document.getElementById(`otp-input-${prevIndex}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = otpInputs.join('');
    if (!/^\d{6}$/.test(otpValue)) {
      toast.error("Please enter a valid 6-digit OTP.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const response = await axiosInstance.post(`${BACKEND_SERVER}/signup/otp`, { otpValue , email,});
      console.log("OTP verified successfully:", response.data);
    
      navigate('/login?message=user signup successfully!');
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response.data.error, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="otp-form">
      <ToastContainer />
      <div className="card">
        <h2 className="heading">Verification</h2>
        <p className="description">We sent you a one-time OTP on your email ID</p>
        <form className="form" onSubmit={handleVerifyOTP}>
          <div className="otp-container">
            {otpInputs.map((digit, index) => (
              <input
                key={index}
                type="text"
                className="otp-input"
                id={`otp-input-${index}`}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength="1"
                disabled={index > 0 && !otpInputs[index - 1]}
              />
            ))}
          </div>
          <button type="submit" className="login_btn">Confirm OTP</button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtpEmail;

