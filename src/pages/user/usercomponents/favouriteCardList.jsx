import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CardOne } from './serviceProviderCard';
import { BACKEND_SERVER } from '../../../secrets/secret.js';
import '../../../style/usercards.css';
import { useData } from '../../contexts/userDataContext.jsx';

export function FavoriteCardList() { 
  const [favorites, setFavorites] = useState([]);
  const {user} = useData()
  
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const id = user.userid
        const response = await axios.post(`${BACKEND_SERVER}/favorites`,{id}); 
        if (response.data.success) {
          setFavorites(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching favorite cards:', error);
      }
    }

    fetchFavorites();
  }, []);

  return (
    
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {favorites.length > 0 ? (
          favorites.slice(0, 8).map((profile) => (
            <CardOne key={profile._id} profile={profile} />
          ))
        ) : (
          <p>No favorite mentors found.</p>
        )}
      </div>
   
    
  );
}
