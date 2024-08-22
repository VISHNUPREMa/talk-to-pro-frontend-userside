import React, { useState } from 'react';

const ReviewEditModal = ({ show, handleClose, review, handleEdit }) => {
    const [editedReview, setEditedReview] = useState(review);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedReview({ ...editedReview, [name]: value });
    };

    const handleSubmit = () => {
        handleEdit(editedReview);
        handleClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
                <div className="flex justify-between items-center border-b p-4">
                    <h3 className="text-xl font-semibold">Edit Review</h3>
                    <button onClick={handleClose} className="text-gray-600 hover:text-gray-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-4">
                    <input
                        type="text"
                        name="title"
                        value={editedReview.title}
                        onChange={handleChange}
                        placeholder="Review title"
                        className="w-full p-2 mb-4 border rounded"
                    />
                    <textarea
                        name="content"
                        value={editedReview.content}
                        onChange={handleChange}
                        placeholder="Edit your review"
                        className="w-full p-2 border rounded"
                    ></textarea>
                </div>
                <div className="flex justify-end border-t p-4">
                    <button
                        onClick={handleClose}
                        className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewEditModal;
