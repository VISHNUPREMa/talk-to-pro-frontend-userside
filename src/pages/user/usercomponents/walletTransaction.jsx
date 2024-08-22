// Modal.js
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const TransactionModal = ({ isOpen, onClose, transactions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 py-2 px-4">From</th>
              <th className="border-b-2 py-2 px-4">Amount</th>
              <th className="border-b-2 py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td className="border-b py-2 px-4">{transaction.walletDetails.from}</td>
                <td className="border-b py-2 px-4">{transaction.walletDetails.amount}</td>
                <td className="border-b py-2 px-4">{transaction.walletDetails.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionModal;
