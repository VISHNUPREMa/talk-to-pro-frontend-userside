import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../instance/axiosInstance.jsx';
import { useData } from '../../contexts/userDataContext.jsx';
import { BACKEND_SERVER } from '../../../secrets/secret.js';
import '../../../style/userbooking.css';
import '../../../style/pagination.css'; // Import the new CSS file
import Navbar from './navbar.jsx';

function UserTransactions() {
    const { user } = useData();
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 5;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axiosInstance.post(`${BACKEND_SERVER}/transaction`, { userId: user.userid });
                if (response.data) {
                    setTransactions(response.data.data);
                } else {
                    console.error('Failed to fetch transactions');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchTransactions();
    }, [user.userid]);

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(transactions.length / transactionsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div style={{ width: '100vw' }}>
            <div className="navbar-fixed">
                <Navbar />
            </div>
            <div className="user-booking" >
                <h1>Your Transactions</h1>
                <div className="table-responsive">
                    <table className="table table-hover table-nowrap" id='table'>
                        <thead className="thead-light">
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Amount</th>
                                <th>Mode</th>
                                <th>At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTransactions.length > 0 ? (
                                currentTransactions.map((transaction, index) => (
                                    <tr key={index}>
                                        <td>{transaction.date}</td>
                                        <td>{transaction.time}</td>
                                        <td>{transaction.fromUsername}</td>
                                        <td>{transaction.toUsername}</td>
                                        <td>{transaction.amount}</td>
                                        <td>{transaction.modeOfPay}</td>
                                        <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {transactions.length > transactionsPerPage && (
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
        <ul id='ul'>
            {pageNumbers.slice(
                Math.max(0, currentPage - 3),
                Math.min(currentPage + 2, pageNumbers.length)
            ).map((number) => (
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
            id="next" className='btn-transaction'
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
}

export default UserTransactions;
