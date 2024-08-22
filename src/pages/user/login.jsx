import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import '../../style/login.css';
import { BACKEND_SERVER } from '../../secrets/secret.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './usercomponents/jwtAuthContext';
import { useData } from '../contexts/userDataContext';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../instance/axiosInstance';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
              
function useEmail() {    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return { email, setEmail, password, setPassword };
}

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, setEmail, password, setPassword } = useEmail();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const { setToken } = useContext(AuthContext);
  const { setUser: setGlobalUser } = useData({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  const handleForgetPassword = (e) => {
    e.preventDefault();
    navigate("/forgetpassword");
  };

  const googleSignUp = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  const handleGoogleLogout = () => {
    googleLogout();
    setUser(null);
    setProfile(null);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const message = searchParams.get('message');
    if (message) {
      toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: 'application/json',
              },
            }
          );
          console.log("res : ", res.data.email);
          const userEmail = res.data.email;
          
          const response = await axios.post(`${BACKEND_SERVER}/login/googleauth`, {
            userEmail,
          });
  
          if (response.status === 200) {
            console.log("response :", response.data);
              const { accessToken, refreshToken, userInfo } = response.data.data.data;
        console.log([accessToken, refreshToken, userInfo ]);
        document.cookie = `accessToken=${accessToken}; path=/`;
        console.log("a");
        localStorage.setItem('refreshToken', refreshToken);
        console.log("b");
        setGlobalUser(userInfo);
        console.log("c");
        navigate('/');
          } else {
            toast.error('An error occurred during login.', {
              position: 'top-right',
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } catch (error) {
          console.error('Error during login:', error);
          toast.error(error.response?.data?.error || 'An error occurred during signup.', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }   
      }
    };
  
    fetchUserInfo();
  }, [user, setToken, setGlobalUser, navigate, location]);

  const handleLogin = async (e) => {      
    e.preventDefault();
    try {
      console.log('Email:', email);
      console.log('Password:', password);
      const response = await axiosInstance.post(`${BACKEND_SERVER}/login`, { email, password });
      console.log("response : ",response);
      if (response.data.success) {
        console.log(response);
        alert("enter")
        console.log("response : ",response.data.data);
        const { accessToken, refreshToken, userInfo } = response.data.data;
        console.log([accessToken, refreshToken, userInfo ]);
        document.cookie = `accessToken=${accessToken}; path=/`;
        console.log("a");
        localStorage.setItem('refreshToken', refreshToken);
        console.log("b");
        setGlobalUser(userInfo);
        console.log("c");
        navigate('/');       
        console.log("d");     
       
      }else{
        console.log("not entered");
        toast.error(response?.data?.message || 'An error occurred during signup.', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || 'An error occurred during signup.', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="card">
        <h2>Login Form</h2>
        <div className="login_register">
          <a className="login1" href="/login">Login</a>
          <a onClick={handleSignup} className="register1">Signup</a>
        </div>
        <form className="form" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email Address" 
            className="email" 
            onChange={(e) => setEmail(e.target.value)} 
          />   
          <div className="password-container">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="pass" 
              onChange={(e) => setPassword(e.target.value)} 
            />         
            <span    
              type="button" 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="login_btn">Login</button>
        </form>
        <a onClick={handleForgetPassword} className="fp">Forgot password?</a>
        <button type="button" className="login-with-google-btn" onClick={googleSignUp}>Register with Google</button>
        {profile && (
          <button type="button" className="logout-with-google-btn" onClick={handleGoogleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;

