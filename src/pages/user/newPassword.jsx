import React, { useState } from 'react';
import '../../style/newpassword.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useEmail } from '../contexts/userEmailContext';
import { BACKEND_SERVER } from '../../secrets/secret.js';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axiosInstance from '../../instance/axiosInstance';

function NewPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { email } = useEmail();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const passwordRegex = /^[a-zA-Z0-9_]+$/;

    if (newPassword !== confirmPassword ) {
      toast.error("Passwords do not match.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }else{
      if(passwordRegex.test(newPassword)){
        toast.error("Invalid password.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;

      }
    }

    try {
      alert(email)
      alert(newPassword)
      const response = await axiosInstance.post(`${BACKEND_SERVER}/forgetpassword/resetpassword`, { email, newPassword });
      console.log("Password changed successfully:", response.data);
     
      navigate('/login?message=password changed successfully!');
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Error changing password.", {
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
    <div className="new-password-form">
      <ToastContainer />
      <div className="card">
        <h2 className="heading">Set New Password</h2>
        <form className="form" onSubmit={handlePasswordChange}>
          <div className="input-container">
            <label htmlFor="new-password" className="label">New Password</label>
            <div className="password-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="input-container">
            <label htmlFor="confirm-password" className="label">Confirm New Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button type="submit" className="submit_btn">Change Password</button>
        </form>
      </div>
    </div>
  );
}

export default NewPasswordPage;
