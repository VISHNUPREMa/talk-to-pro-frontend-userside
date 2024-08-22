import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../instance/axiosInstance';
import '../../../style/userbooking.css';
import { useData } from '../../contexts/userDataContext';
import { BACKEND_SERVER } from '../../../secrets/secret.js';
import Navbar from './navbar';
import { FaLongArrowAltRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserBooking = () => {
  const navigate = useNavigate()
  const { user } = useData();
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  useEffect(() => {
    const userId = user.userid;
    const availableBookings = async () => {
      try {
        const response = await axiosInstance.post(`${BACKEND_SERVER}/userbooking`, { userId });
        if (response.data.success) {
          setBookings(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    availableBookings();
  }, [user]);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(bookings.length / bookingsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleInvoicePage = (book) => {
    navigate("/invoice", { state: { book: book } });
  };

  const cancelbooking = async(id,time,date)=>{
    try {
      const response = await axiosInstance.patch(`${BACKEND_SERVER}/cancelbooking`,{bookingId:id,cancelBy:user.userid,time,date});
      if(response){
        console.log("response data : ",response.data.message);
        
        toast(response.data.message)
        
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  

  
  return (
    <div style={{ width: '100vw' }}>
      <div className="navbar-fixed">
        <Navbar />
      </div>
      <ToastContainer />
      <div className="user-booking">
        <h1>Your Bookings</h1>
        <div className="table-responsive">
          <table className="table table-hover table-nowrap" id="table">
            <thead className="thead-light">
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Mentor</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Action</th>
                <th>More</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length > 0 ? (
                currentBookings.map((book, index) => {
                  const formattedDate = new Date(book.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });

                  return (
                    <tr key={index}>
                      <td>{formattedDate}</td>
                      <td>{book.slots.time}</td>
                      <td>{book.providedByUsername}</td>
                      <td>
                        <span
                          className={`badge badge-lg ${
                            book.slots.status === 'Booked' ? 'badge-dot text-success' : 'badge-dot text-danger'
                          }`}
                        >
                          <i
                            className={`bi ${book.slots.status === 'Booked' ? 'bi-check-circle' : 'bi-x-circle'}`}
                          ></i>
                          <span className="fw-bold">{book.slots.status}</span>
                        </span>
                      </td>
                      <td>{book.slots.amount}</td>
                      <td onClick={() => handleInvoicePage(book)}>
  View Invoice <FaLongArrowAltRight />
</td>
<td onClick={()=>cancelbooking(book.bookingId,book.slots.time,book.date)} style={{cursor:'pointer'}}>{book.slots.status === 'Booked'?'Calcel Booking':null}</td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5">No Bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {bookings.length > bookingsPerPage && (
          <div className="pagination-transaction neumorphic-pagination">
            <button
              id="previous"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) paginate(currentPage - 1);
              }}
              disabled={currentPage === 1}
            >
              Prev.
            </button>
            <ul id="ul">
              {pageNumbers
                .slice(Math.max(0, currentPage - 3), Math.min(currentPage + 2, pageNumbers.length))
                .map((number) => (
                  <li
                    key={number}
                    className={`page-item-transaction ${currentPage === number ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      paginate(number);
                    }}
                  >
                    {number}
                  </li>
                ))}
            </ul>
            <button
              id="next"
              className="btn-transaction"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < pageNumbers.length) paginate(currentPage + 1);
              }}
              disabled={currentPage === pageNumbers.length}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBooking;
