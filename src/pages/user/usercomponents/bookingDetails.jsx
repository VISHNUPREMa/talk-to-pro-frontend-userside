// BookingDetails.js
import React from 'react';
import '../../../style/bookingdetails.css'
import Navbar from './navbar'

const BookingDetails = ({ bookings, onClose }) => {
  const mockBookings = [
    { id: '1', date: '2023-07-21', service: 'Consultation' },
    { id: '2', date: '2023-07-22', service: 'Follow-up' },
    { id: '3', date: '2023-07-23', service: 'Therapy Session' },
  ];

  return (
    <>

        <Navbar />
  
   
    <div className="booking-details-popup">
      <button className="close-btn" onClick={onClose}>X</button>
      <h2>Your Bookings</h2>
      <ul>
        {mockBookings.map((booking, index) => (
          <li key={index}>
            <p>Booking ID: {booking.id}</p>
            <p>Date: {booking.date}</p>
            <p>Service: {booking.service}</p>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default BookingDetails;

