import React, { useContext, useState, useEffect } from 'react';
import { Heart, Share, Linkedin } from 'lucide-react';
import '../../../style/profilCard.css';
import ProfileContext from '../context/profileContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../usercomponents/navbar';
import { useData } from '../../contexts/userDataContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../instance/axiosInstance';
import { BACKEND_SERVER } from '../../../secrets/secret';
import Swal from 'sweetalert2';
import { MdOutlineReviews } from "react-icons/md";

export function ProfileCard() {
  const navigate = useNavigate();
  const { user } = useData();
  const { proProfile } = useContext(ProfileContext);
  const data = proProfile;
  const userId = data.userid;
  const proId = user?.userid;

  const [alreadyFollowed, setAlreadyFollowed] = useState(false);
  const [avgReview, setAvgReview] = useState(0);
 
  const [proData, setProData] = useState(null); 

  useEffect(() => {
    const fetchBookedData = async () => {
      try {
        const response = await axiosInstance.post(`${BACKEND_SERVER}/singlePro`, { userId });
        if (response.data.success) {
           console.log("response.data.data : ",response.data.data[0].followedBy);
          setProData(response.data.data);
          console.log("response.data.data : ",response.data.data[0].followedBy);
          if (response.data.data[0].followedBy.includes(proId)) {
            
            
            setAlreadyFollowed(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookedData();
    setAvgReview(data.reviews.reduce((acc, cur) => acc + cur, 0) / data.reviews.length);
   
  }, [proId, userId]);

  if (!proData) {
    return <p>Loading...</p>; // Add a loading state to handle the initial data fetching
  }
  const profile = {
    profilepic: `${BACKEND_SERVER}/public/${proData[0].profilepic}`,
    username: proData[0].userdetails.username || "Username not available",
    profession: proData[0].profession || "Profession not available",
    description: proData[0].description || "Description not available",
    languages: proData[0].languages || [],
    skills: proData[0].domain || [],
    experience: proData[0].experience || 0,
    reviews: proData[0].reviews.length > 0 
              ? (proData[0].reviews.reduce((acc, cur) => acc + cur, 0) / proData[0].reviews.length)
              : 0, // Handles division by zero
    followers: proData[0].followedBy.length
  };
  

  const handleBooking = async (e) => {
    e.preventDefault();
    if (userId === proId) {
      toast.error('Cannot book your own time slot', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      navigate("/slotbooking");
    }
  };

  const handleLinkedin = (e) => {
    e.preventDefault();
    console.log("pro data : ", profile.reviews);
    alert("LinkedIn link");
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    // Follow/Unfollow logic with Swal and API calls...
    try {
      if (alreadyFollowed) {
    
        const result = await Swal.fire({
          title: "Confirmation",
          text: "Do you want to unfollow the mentor?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, unfollow!",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
     
          const response = await axiosInstance.patch(`${BACKEND_SERVER}/unfollow`, { userId, proId });
      
          if (response.data.success) {
          
            await Swal.fire({
              title: "Success",
              text: "You have unfollowed the mentor successfully.",
              icon: "success",
              confirmButtonText: "OK",
            });
            setAlreadyFollowed(false); 
          } else {
          
            Swal.fire({
              title: "Error",
              text: "Failed to unfollow the mentor. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        }
      } else {
        
        const response = await axiosInstance.patch(`${BACKEND_SERVER}/follow`, { userId, proId });
        console.log("response : ",response.data);
        
        if (response.data.success) {
         
          await Swal.fire({
            title: "Success",
            text: "You have followed the mentor successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
          setAlreadyFollowed(true); 
        } else {
         
          Swal.fire({
            title: "Error",
            text: "Failed to follow the mentor. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

  };

  const handleReview = async () => {
    try {
      navigate('/review', { state: { userId } });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ width: '100vw' }}>
      <ToastContainer />
      <div className="navbar-fixed">
        <Navbar />
      </div>
      <div className="profile-card mx-auto max-w-6xl px-2 py-6 lg:px-0" style={{ marginTop: '50px', overflowY: 'auto' }}>
        <div className="overflow-hidden">
          <div className="mb-6 pt-4 md:px-6 md:pt-6 lg:mb-2 lg:p-6 2xl:p-8 2xl:pt-8">
            <div className="items-start justify-between lg:flex lg:space-x-8">
              <div className="mb-6 items-center justify-center overflow-hidden md:mb-8 lg:mb-0 xl:flex">
                <div className="w-full xl:flex xl:flex-row-reverse">
                  <div className="profileCard-image relative mb-2.5 w-full shrink-0 overflow-hidden rounded-md border md:mb-3 xl:w-[275px] 2xl:w-[300px]">
                    <div className="profileCard-image-inner relative">
                      <img
                        alt="Profile"
                        src={profile.profilepic}
                        className="rounded-lg object-cover w-full h-full"
                        style={{ aspectRatio: '1.8 / 2' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="profileCard-div flex flex-col lg:w-[400px] xl:w-[400px] 2xl:w-[400px]">
                <div className="pb-4">
                  <h2 className="text-lg font-semibold md:text-xl xl:text-2xl">{profile.username}</h2>
                  <p className="mt-2 font-semibold">⭐ {profile.reviews.toString().slice(0, 4)}/5</p>
                  <p className="mt-2 font-semibold">Followed by {profile.followers} users</p>
                </div>
                <div className="mb-2 pt-0.5">
                  <h4 className="text-15px mb-2 font-normal capitalize text-opacity-70">
                    Languages:
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {profile.languages.map((language) => (
                      <span key={language} className="language-tag">{language}</span>
                    ))}
                  </div>
                </div>
                <div className="profile-profession pt-2">
                  <span>{profile.profession}</span>
                </div>
                <div className="profile-skills pt-2">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <span>{profile.experience} years of experience</span>
                <div className="pt-3 xl:pt-4">
                  <h3 className="text-15px mb-2 font-semibold sm:text-base lg:mb-3.5">
                    Description:
                  </h3>
                  <p className="text-sm">
                    {profile.description}
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-600"
                  onClick={handleBooking}
                >
                  BOOK NOW
                </button>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80"
                    onClick={handleFollow}
                  >
                    {!alreadyFollowed && <Heart size={16} className="mr-3" />}
                    {alreadyFollowed ? 'UNFOLLOW' : 'FOLLOW'}
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80"
                    onClick={handleLinkedin}
                  >
                    <Linkedin size={16} className="mr-3" />LINKEDIN
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80"
                    onClick={handleReview}
                  >
                    <MdOutlineReviews size={20} style={{ marginRight: '10px' }} />
                    REVIEWS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
