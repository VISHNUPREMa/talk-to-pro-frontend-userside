// src/components/CardOne.js
import React, { useContext, useEffect } from 'react';
import { BACKEND_SERVER } from '../../../secrets/secret.js';
import { useNavigate } from 'react-router-dom';
import ProfileContext from '../context/profileContext';

export function CardOne({ profile }) {
  const navigate = useNavigate();
  const { setProProfile } = useContext(ProfileContext);

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      setProProfile(profile);
      navigate('/profile');
    } catch (error) {
      console.error("Error setting profile:", error);
    }
  };

  return (
    <div className="relative h-[340px] w-[260px] rounded-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <img
        src={`${BACKEND_SERVER}/public/${profile.profilepic}`}
        alt="Profile"
        className="z-0 h-full w-full rounded-md object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute bottom-4 left-4 text-left">
        <h1 className="text-lg font-semibold text-white">{profile.profession}</h1>
        <p className="mt-2 text-sm text-gray-300">{profile.description}</p>
        <button className="mt-2 inline-flex cursor-pointer items-center text-sm font-semibold text-white" onClick={handleProfile}>
          View Profile &rarr;
        </button>
      </div>
    </div>
  );
}
