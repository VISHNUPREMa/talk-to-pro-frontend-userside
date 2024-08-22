import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../../style/reviewpage.css';
import axiosInstance from '../../../instance/axiosInstance';
import { BACKEND_SERVER } from '../../../secrets/secret';
import { useData } from '../../contexts/userDataContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './navbar';
import ReviewEditModal from './revieweditmodal'; // Import the modal component

const ReviewPage = () => {
    const { user } = useData();
    const location = useLocation();
    const { userId } = location.state;

    const [reviews, setReviews] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [ratingPercentages, setRatingPercentages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        fetchReviews();
        fetchRatings();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axiosInstance.post(`${BACKEND_SERVER}/fetchreview`, { userId });
            if (response.data.success) {
                setReviews(response.data.data.reviews);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchRatings = async () => {
        try {
            const response = await axiosInstance.post(`${BACKEND_SERVER}/fetchratings`, { userId });
            if (response.data.success) {
                const ratingsData = response.data.data;
                setRatings(ratingsData);
                calculatePercentages(ratingsData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const calculatePercentages = (ratings) => {
        const totalRatings = ratings.length;
        const ratingCounts = [0, 0, 0, 0, 0];
        if (totalRatings === 0) {
            setRatingPercentages([0, 0, 0, 0, 0]);
            return;
        }

        ratings.forEach((rating) => {
            if (rating >= 1 && rating <= 5) {
                ratingCounts[rating - 1] += 1;
            }
        });

        const percentages = ratingCounts.map((count) => Math.ceil((count / totalRatings) * 100));
        setRatingPercentages(percentages);
    };

    const addReview = async (newReview) => {
        try {
            const id = user.userid;
    
            const response = await axiosInstance.post(`${BACKEND_SERVER}/addreview`, {
                newReview,
                userId,
                id,
            });
    
            if (response.data.success) {

                setReviews([response.data.data, ...reviews]);
                toast.success("Review added successfully!");
            } else {
                toast.error(response.data.message, {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            console.log('Error adding review:', error);
            toast.error("Error adding review.");
        }
    };
    

    const handleEditClick = (review) => {
        setSelectedReview(review);
        setShowModal(true);
    };

    const handleEdit = async (editedReview) => {
        try {
            
            

            const response = await axiosInstance.put(`${BACKEND_SERVER}/editreview`, {
                editedReview,userId
            });

            if (response.data.success) {
                const updatedReviews = reviews.map((review) =>
                    review._id === editedReview._id ? editedReview : review
                );
                setReviews(updatedReviews);
                toast.success("Review updated successfully!");
            } else {
                toast.error("Failed to update review.");
            }
        } catch (error) {
            console.log('Error editing review:', error);
        }
    };

    const handleDeleteClick = async (review) => {
        try {
            const response = await axiosInstance.post(`${BACKEND_SERVER}/deletereview`, {
                review,
                userId
            });
    
            if (response.data.success) {
                // Filter out the deleted review from the reviews array
                setReviews(reviews.filter((r) => r.content !== review.content));
                toast.success("Review deleted successfully!");
            } else {
                toast.error("Failed to delete review.");
            }
        } catch (error) {
            console.log('Error deleting review:', error);
            toast.error("Error deleting review.");
        }
    };
    

    const ReviewCard = ({ review }) => (
        
        <div className="review-card">
            <h4>{review.title}</h4>
            <p>{review.content}</p>
            <div className="review-details">
                <span>{review.reviewerName}</span>
                <span>{review.date}</span>
             
            </div>
            {user.userid === review.reviewerId ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button style={{ marginRight: '20px' }} onClick={() => handleEditClick(review)}>Edit</button>
                    <button onClick={() => handleDeleteClick(review)}>Delete</button>
                </div>
            ) : null}
        </div>
    );

    return (
        <>
            <div className="navbar-review">
                <Navbar />
            </div>

            <div className="scrollable-container">
                <div className="review-page">
                    <div className="customer-reviews">
                        <h1>Customer reviews</h1>
                        <div className="rating-summary">
                           
                         
                            <div className="rating-bars">
                                {ratingPercentages.map((percentage, index) => (
                                    <RatingBar key={index} stars={index + 1} percentage={percentage} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="review-list">
                        <h3>Top reviews</h3>
                        {reviews.map((review, index) => (
                            <ReviewCard key={index} review={review} />
                        ))}
                    </div>

                    <ReviewForm addReview={addReview} />
                </div>
            </div>

            {selectedReview && (
                <ReviewEditModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    review={selectedReview}
                    handleEdit={handleEdit}
                />
            )}
        </>
    );
};

const RatingBar = ({ stars, percentage }) => (
    <div className="rating-bar">
        <span>{stars} star</span>
        <div className="bar">
            <div style={{ width: `${percentage}%` }}></div>
        </div>
        <span>{percentage}%</span>
    </div>
);

const ReviewForm = ({ addReview }) => {
    const [newReview, setNewReview] = useState({
        username: "",
        title: "",
        date: new Date().toLocaleDateString(),
        text: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addReview(newReview);
        setNewReview({
            username: "",
            title: "",
            date: new Date().toLocaleDateString(),
            text: "",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <ToastContainer />
            <h3>Review this product</h3>
            <input
                type="text"
                value={newReview.username}
                onChange={(e) => setNewReview({ ...newReview, username: e.target.value })}
                placeholder="Your name"
            />
            <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                placeholder="Review title"
            />
            <textarea
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                placeholder="Write your review here..."
            ></textarea>
            <button type="submit">Submit Review</button>
        </form>
    );
};

export default ReviewPage;
