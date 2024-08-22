
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import '../../../style/starrating.css'

const StarRating = ({ onRating }) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  const handleClick = (rate) => {
    setRating(rate);
    onRating(rate); // Pass the selected rating to the parent component
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleClick(ratingValue)}
              style={{ display: "none" }}
            />
            <FaStar
              className="star"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              size={30}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
