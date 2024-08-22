import React, { useState, useEffect } from 'react';
import '../../style/verifyOtpEmail.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useEmail } from '../contexts/userEmailContext';
import { BACKEND_SERVER } from '../../secrets/secret.js';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../instance/axiosInstance';


function OtpPage() {
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [resendVisible, setResendVisible] = useState(false);
  const [expired,setExpired] = useState(false)
  const navigate = useNavigate();
  const { email } = useEmail();

  useEffect(() => {
    if (timer > 0) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setResendVisible(true);
      setExpired(true)
    }
  }, [timer]);

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
      if(expired){
              
      toast.error("otp expired !!!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      }else{
        const response = await axiosInstance.post(`${BACKEND_SERVER}/forgetpassword/verifyotp`, { otpValue,email });
        if(response.data.success){
          console.log("OTP verified successfully:", response.data);
        navigate('/newpassword?message=passwordChange successfully!');
        }

      }
    
    } catch (error) {
      alert("error");
      console.log(error);
 
    }
  };

  const handleResendOtp = async () => {
    try {

      setExpired(false)
      const response = await axiosInstance.post(`${BACKEND_SERVER}/resend-otp`, { email });
      console.log("OTP resent successfully:", response.data);
      toast.success("OTP resent successfully.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimer(30);
      setResendVisible(false);
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Error resending OTP.", {
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
        <div className="timer">
          {timer > 0 ? (
            <p>Resend OTP in {timer} seconds</p>
          ) : (
            resendVisible && <button onClick={handleResendOtp} className="resend-btn">Resend OTP</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OtpPage;

