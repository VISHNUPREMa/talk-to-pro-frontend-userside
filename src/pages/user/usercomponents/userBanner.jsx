import React, { useState } from 'react';
import { BACKEND_SERVER } from '../../../secrets/secret.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../instance/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/userDataContext';

export function UserBanner() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const { user, setUser } = useData();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    profession: '',
    domains: '',
    experience: '',
    languages: '',
    profilePic: null,
    description: '',
  });

  const handleRegister = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic' && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      // Generate preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      let token = localStorage.getItem("refreshToken");
      formDataToSend.append('token', token);

      const response = await axiosInstance.post(`${BACKEND_SERVER}/professional/register`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Registration successful!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        closeModal();
        setUser((prevUser) => ({
          ...prevUser,
          isServiceProvider: true,
        }));
      }
    } catch (error) {
      toast.error(error.response?.data || 'An error occurred during registration.', {
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
    <div className="grid place-content-center bg-gray-900">
      <ToastContainer />
      <div className="py-4 my-5 text-center text-white mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Talk to pro</h1>
        <h4 className="text-xl mb-4">
          If you are a professional, earn money with your free time.
        </h4>
        <p className="text-sm mb-4">
          If you are a professional in any field, you have the opportunity to earn money by renting your free time. Build your personal brand through that.
        </p>
        <hr className="border-t border-gray-700 my-4" />
        {user.isServiceProvider === false ? (
          <a onClick={handleRegister} className="btn btn-outline-light border border-white text-white py-2 px-4 rounded-md hover:bg-white hover:text-gray-900">
            Register now
          </a>
        ) :null}
      </div>

      {showModal && (
       <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 overflow-auto">
       <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-screen  overflow-y-auto transform translate-y-10">
         <h2 className="text-2xl mb-4 text-gray-800">Talk to pro</h2>
         <form onSubmit={handleSubmit}>
           <div className="mb-4">
             <label className="block text-gray-700">Profession</label>
             <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" />
           </div>
           <div className="mb-4">
             <label className="block text-gray-700">Domains</label>
             <input type="text" name="domains" value={formData.domains} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" />
           </div>
           <div className="mb-4">
             <label className="block text-gray-700">Experience</label>
             <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" />
           </div>
           <div className="mb-4">
             <label className="block text-gray-700">Languages</label>
             <input type="text" name="languages" value={formData.languages} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" />
           </div>
           <div className="mb-4">
             <label className="block text-gray-700">Profile Picture</label>
             <input type="file" name="profilePic" onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" />
             {previewUrl && (
               <div className="mt-4">
                 <img src={previewUrl} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full" />
               </div>
             )}
           </div>
           <div className="mb-4">
             <label className="block text-gray-700">Description</label>
             <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded"></textarea>
           </div>
           <div className="flex justify-end">
             <button type="button" onClick={closeModal} className="btn btn-outline-dark border border-gray-700 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-700 hover:text-white mr-2">Cancel</button>
             <button type="submit" className="btn btn-outline-dark border border-gray-700 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-700 hover:text-white">Submit</button>
           </div>
         </form>
       </div>
     </div>
     
      )}
    </div>
  );
}
