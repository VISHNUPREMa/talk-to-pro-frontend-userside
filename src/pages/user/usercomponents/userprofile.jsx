import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/userDataContext';
import axiosInstance from '../../../instance/axiosInstance';
import { BACKEND_SERVER } from '../../../secrets/secret';
import Navbar from './navbar';
import '../../../style/userprofile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
  const [initialFormData, setInitialFormData] = useState({});

  const { user } = useData();
  const userid = user.userid;
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    profession: '',
    domain: '',
    experience: '',
    languages: '',
    description: '',
    followedByCount: '',
    profilePic: '',
    linkedinUrl: '',
    resume: null,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: ''
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await axiosInstance.post(`${BACKEND_SERVER}/accountdetails`, { userid });
        if (response.data.success) {
          const accountDetails = response.data.data;
          accountDetails.forEach((data) => {
            const { username, email, isServiceProvider } = data;
  
            const fetchedFormData = {
              username,
              email,
              ...(isServiceProvider ? {
                profession: data.professionalDetails.profession,
                domain: data.professionalDetails.domain.join(" "),
                experience: data.professionalDetails.experience,
                languages: data.professionalDetails.languages.join(" "),
                description: data.professionalDetails.description,
                followedByCount: data.professionalDetails.followedByCount,
                profilePic: data.professionalDetails.profilepic,
                linkedinUrl: data.professionalDetails.linkedinUrl
              } : {})
            };
  
            setFormData(fetchedFormData);
            setInitialFormData(fetchedFormData); // Store the initial data
            if (isServiceProvider) setPreviewUrl(data.professionalDetails.profilepic);
          });
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };
  
    fetchAccountDetails();
  }, [userid]);
  
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlelinkedinurlChange = (e) => {
    setFormData({ ...formData, linkedinUrl: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, value, files } = e.target;
    console.log('name : ',name);
    
    console.log( files[0]);
    
    if (name === 'profilePic' && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

   
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (formData.profilePic !== initialFormData.profilePic || (formData.linkedinUrl !== initialFormData.linkedinUrl && formData.linkedinUrl !== undefined)) {
        const formDataToSend = new FormData();
  
    
        if (formData.profilePic !== initialFormData.profilePic) {
          formDataToSend.append('profilePic', formData.profilePic);
        }
  
        
        if (formData.linkedinUrl !== initialFormData.linkedinUrl && formData.linkedinUrl !== undefined) {
          formDataToSend.append('linkedinUrl', formData.linkedinUrl);
        }
  
      
        formDataToSend.append('userid', userid);
  
        console.log("Saving changes...", formDataToSend);
  
        const response = await axiosInstance.patch(`${BACKEND_SERVER}/editprofilepic`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Handle success or error response
        if (response.data.success) {
          toast.success(response.data.message, {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error(response.data.message, {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        console.log("No changes detected, nothing to save.");
      }
    } catch (error) {
      console.error("Error saving profile changes:", error);
    }
  };
  
  

  // const handleSaveChanges = () => {
  //   const changedFields = {};

  //   for (const key in formData) {
  //     if (formData.hasOwnProperty(key)) {
  //       if (formData[key] !== initialFormData[key]) {
  //         changedFields[key] = {
  //           oldValue: initialFormData[key],
  //           newValue: formData[key]
  //         };
  //       }
  //     }
  //   }
  
 
  //   if (previewUrl !== initialFormData.profilePic) {
  //     changedFields.profilePic = {
  //       oldValue: initialFormData.profilePic,
  //       newValue: previewUrl
  //     };
  //   }
  
  //   if (Object.keys(changedFields).length > 0) {
  //     // Changes detected, proceed with saving
  //     console.log("Saving changes...", changedFields);
  //     // Add your save logic here
  //   } else {
  //     console.log("No changes detected, nothing to save.");
  //   }
  // };
  
  

  const handleSaveNewPassword = async() => {
    try {
      const {confirmPassword,newPassword,oldPassword} = formData;
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9\W])(?=.{6,})(?!.*[.\n]).*$/;
      if(oldPassword !== undefined && passwordRegex.test(oldPassword)){

        if(newPassword !== undefined && passwordRegex.test(newPassword)){
          if(newPassword === confirmPassword){
           const response = await axiosInstance.patch(`${BACKEND_SERVER}/editpassword`,{confirmPassword,newPassword,oldPassword,userid});
           
           
           if(response.data.success){
            
            
            toast.success(response.data.message , {
              position: 'top-right',
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            
           }else{
            toast.error(response.data.message, {
              position: 'top-right',
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
           }
          }else{
            toast.error("password and confirm password missmatch" , {
              position: 'top-right',
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }

        }else{
          toast.error("Invalid new password" , {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

        }
        
      }else{
        toast.error("Invalid old password" , {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      
      
    } catch (error) {
      console.log(error);
      
    }
  };

  const handleuserDetail = async() =>{
    try {
      console.log("form data : ",formData);
      
      if ((JSON.stringify(formData.username) !== JSON.stringify(initialFormData.username)) ||
      (JSON.stringify(formData.email) !== JSON.stringify(initialFormData.email)))
 {

    const email = formData.email;
    const username = formData.username
  
    const response = await axiosInstance.patch(`${BACKEND_SERVER}/edituserdetails`,{userid,email,username});
    if(response.data.success){
      toast.success(response?.data?.message , {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
    }else{
      toast.error(response?.data?.message , {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
 } 
      
    } catch (error) {
      console.log(error);
      
    }
 
}


const handleproDetail = async()=>{
  try {
    const { profession, domain, experience, languages } = formData;
const { profession: pro, domain: dom, experience: exp, languages: lan } = initialFormData;

  const changedDetails = [];
  if(profession !== pro){
    changedDetails.push({'profession':profession})
  }

  if(domain !== dom){
    changedDetails.push({'domain':domain.split(" ")})
  }

  if(experience !== exp){
    changedDetails.push({'experience':experience})
  }

  if(languages !== lan){
    changedDetails.push({'languages' : languages.split(" ")})
  }

  if(changedDetails.length > 0){
    console.log("changedDetails : ",changedDetails);
    const response = await axiosInstance.put(`${BACKEND_SERVER}/editprodetails`,{changedDetails,userid});
    if(response.data.success){
      toast.success(response?.data?.message , {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }else{
      toast.error(response?.data?.message , {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
  


 
    
  } catch (error) {
    console.log(error);
    
  }

}
  

  return (
    <>
      <div className='navbar-user-profile '>
        <Navbar />
      </div>
      <ToastContainer />
      <div className="flex flex-col min-h-screen bg-gray-100" style={{ marginTop: '150px' }}>
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">User Information</h2>
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-gray-700">Username*</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter Your Username"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter Your Email"
                  />
                </div>
              </div>
              <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  onClick={handleuserDetail}
                >
                  Save user Details
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Professional Details</h2>
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-gray-700">Profession*</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter Your Profession"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Domain*</label>
                  <input
                    type="text"
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter Your Domain"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Experience (Years)*</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter Your Experience in Years"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Languages*</label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter Languages You Know"
                  />
                </div>
              </div>
              <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                   onClick={handleproDetail}
                >
                  Save Pro Details
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-gray-700">Old Password*</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter Your Old Password"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">New Password*</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter Your New Password"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Confirm New Password*</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Re-enter Your New Password"
                  />
                </div>
                <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  onClick={handleSaveNewPassword}
                >
                  Save Password
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white shadow-md rounded-lg p-6 w-full md:w-1/2 lg:w-1/3" style={{ marginLeft: '20px' }}>
            <h2 className="text-2xl font-semibold mb-4">Profile Picture & LinkedIn</h2>
            <div className="flex flex-col space-y-4">
              {previewUrl && (
                <div className="mt-4">
                <img 
                 src={previewUrl.startsWith('data:') ? previewUrl : `${BACKEND_SERVER}/PUBLIC/${previewUrl}`} 
                 alt="Profile Preview" 
                 className="w-32 h-32 object-cover rounded-full" 
                 />
                </div>
              )}
              <div className="flex flex-col space-y-4">
                <label className="block text-gray-700">Profile Picture*</label>
                <input
                  type="file"
                  name="profilePic"
                  onChange={handleFileChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  accept="image/*"
                />
              </div>
              <div className="flex flex-col space-y-4">
                <label className="block text-gray-700">LinkedIn*</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedinUrl}
                  onChange={handlelinkedinurlChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  accept=".pdf,.doc,.docx"
                />
              </div>
            </div>
            <button
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
