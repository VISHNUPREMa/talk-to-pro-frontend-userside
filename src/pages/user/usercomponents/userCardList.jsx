import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CardOne } from './serviceProviderCard';
import { BACKEND_SERVER } from '../../../secrets/secret.js';
import SearchContext from '../context/searchContext';
import { useNavigate } from 'react-router-dom';
import '../../../style/usercards.css';

export function CardList({ showMore = true }) {
 
  const { searchTerm, ratingFilter } = useContext(SearchContext);
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(8); 

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(`${BACKEND_SERVER}/cards`, { page, limit });
        if (response.data) {
          const {allProData,totalCount} = response.data.data
          setProfiles(allProData);
          setTotalCount(totalCount);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    }

    fetchData();
  }, [page]);

  let filteredProfiles = profiles;

  if (ratingFilter !== "" && searchTerm !== "") {
    filteredProfiles = profiles.filter(profile => {
      const reviews = profile.reviews;
      const avgRating = reviews.reduce((sum, rating) => sum + rating, 0) / reviews.length;
      const ratingMatches = avgRating >= parseInt(ratingFilter);
      const searchTermMatches = profile.profession.toLowerCase().includes(searchTerm.toLowerCase());
      return ratingMatches && searchTermMatches;
    });
  } else if (ratingFilter !== "") {
    filteredProfiles = profiles.filter(profile => {
      const reviews = profile.reviews;
      const avgRating = reviews.reduce((sum, rating) => sum + rating, 0) / reviews.length;
      return avgRating >= parseInt(ratingFilter);
    });
  } else if (searchTerm !== "") {
    filteredProfiles = profiles.filter(profile =>
      profile.profession.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const handleSearchPage = async (e) => {
    e.preventDefault();
    try {
      navigate("/search");
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <>
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {filteredProfiles.length > 0 ? (
          (showMore ? filteredProfiles : filteredProfiles.slice(0, 8)).map((profile) => (
            <CardOne key={profile._id} profile={profile} />
          ))
        ) : (
          <p>No mentors found matching your search criteria.</p>
        )}
      </div>

      {!showMore && (
        <div className="pagination-card">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span> {page} </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {showMore && (
        <div className="wrapper" onClick={handleSearchPage}>
          <div className="link_wrapper">
            <a className="special-link">Show More !</a>
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 268.832 268.832">
                <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z"/>
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
