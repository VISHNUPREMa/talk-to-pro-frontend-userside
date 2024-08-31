import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from "../pages/user/signup";
import App from "../App";
import Login from "../pages/user/login";
import VerifyOtpEmail from "../pages/user/verifyOtpEmail";
import ForgetPasswordEmail from "../pages/user/forgetPasswordEmail";
import OtpPage from "../pages/user/otpPage";
import  UserHome  from "../pages/user/userHome";
import Dashboard from "../pages/user/usercomponents/jwtDashboard";
import { ProfileCard } from "../pages/user/usercomponents/profileCard";
import NewPasswordPage from "../pages/user/newPassword";
import Booking from "../pages/user/slotbooking";
import Console from "../pages/serviceprovider/console";
import ServiceProviderBooking from "../pages/user/service-provider-components.jsx/allocateSlot";

import { AuthProvider } from '../pages/user/usercomponents/jwtAuthContext';
import UserBooking from "../pages/user/usercomponents/userBooking";
import UserTransactions from "../pages/user/usercomponents/userTransactions";
import VideoCall from "../videocall";
import NotificationDetails from "../pages/user/usercomponents/notification-details";
import ProfileEditPage from "../pages/user/usercomponents/editUser";
import SearchPage from "../pages/user/searchPage";
import UserProfile from "../pages/user/usercomponents/userprofile";
import Invoice from "../pages/user/usercomponents/invoice";
import ReviewPage from "../pages/user/usercomponents/reviewpage";
import Wallet from "../pages/user/usercomponents/wallet";
import Favourites from "../pages/user/usercomponents/favourites";




function Routers(){
    return(
         
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verifyotp" element={<VerifyOtpEmail />} />
          <Route path="/forgetpassword" element={<ForgetPasswordEmail />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/forgetpassword/otp" element={<OtpPage />} />
          <Route path="/" element={<UserHome />} />
          <Route path="/profile" element={<ProfileCard/>} />
          <Route path="/newpassword" element={<NewPasswordPage/>} />
          <Route path="/slotbooking" element={<Dashboard><Booking/></Dashboard>} />
          <Route path="/proconsole" element={<Dashboard><Console/></Dashboard>} />
          <Route path="/allocateslot" element={<Dashboard><ServiceProviderBooking/></Dashboard>} />
          <Route path="/booking" element={<Dashboard><UserBooking/></Dashboard>} />
          <Route path="/transaction" element={<Dashboard><UserTransactions/></Dashboard>} />
           <Route path="/videocall" element={<Dashboard><VideoCall/></Dashboard>} /> 
           <Route path="/singlenotification" element={<Dashboard><NotificationDetails/></Dashboard>} /> 
           <Route path="/edit" element={<Dashboard><ProfileEditPage/></Dashboard>} /> 
           <Route path="/search" element={<SearchPage/>} /> 
           <Route path="/accountdetails" element={<Dashboard><UserProfile/></Dashboard>} /> 
           <Route path="/invoice" element={<Dashboard><Invoice/></Dashboard>} /> 
           <Route path="/review" element={<ReviewPage/>} /> 
           <Route path="/wallet" element={<Wallet/>} /> 
           <Route path="/favourites" element={<Dashboard><Favourites/></Dashboard>} /> 
           

          
         


        
          

          
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    )
}

export default Routers