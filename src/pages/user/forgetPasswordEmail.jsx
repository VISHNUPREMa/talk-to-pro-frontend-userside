import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../instance/axiosInstance';
import { BACKEND_SERVER } from '../../../../admin/src/secret/secret';
import { useEmail } from '../contexts/userEmailContext'; 

function ForgetPasswordEmail() {
  const navigate = useNavigate()
  const [ email , setEmail] = useState("")
  const { setEmail: setGlobalEmail } = useEmail(); 


  const forgetPasswordOtp = async(e) => {
    e.preventDefault();
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailPattern.test(email)) {
        setGlobalEmail(email)

        const response = await axiosInstance.post(`${BACKEND_SERVER}/forgetpassword/otp`,{email});
        if(response.data.success){
          console.log("response : ",response.data);
          navigate('/forgetpassword/otp')
        }else{
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

        }
      
        
      } else {
        toast.error("Invalid Email Address", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      
    } catch (error) {
      console.log(error);
      
    }
 
    


  }
  return (
    <div>
        <ToastContainer />
      <div className="card">
         <h2 className='heading'>Forget password</h2>
        <br />
        <p className='description'>To create a new password<hr /> write your registered email</p>

     
       

       
        <form className="form">
    
          <input type="email" placeholder="Email Address" className="email" onChange={(e)=>setEmail(e.target.value)} />
          
       
        </form>


        

        <button type="submit" className="login_btn" onClick={forgetPasswordOtp}>Get OTP</button>
        </div>
      </div>
      
  
  )
}

export default ForgetPasswordEmail
