import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import { FaWallet } from 'react-icons/fa';
import { useData } from '../../contexts/userDataContext';
import axiosInstance from '../../../instance/axiosInstance';
import { BACKEND_SERVER } from '../../../secrets/secret';
import TransactionModal from './walletTransaction';// Import the Modal component
import '../../../style/wallet.css';

const Wallet = () => {
  const [amount, setAmount] = useState(500);
  const [walletData, setWalletData] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const { user } = useData();
  const userId = user.userid;

  useEffect(() => {
    fetchWalletData();
  }, [user.userid]);

  const fetchWalletData = async () => {
    try {
      const response = await axiosInstance.post(`${BACKEND_SERVER}/fetchwallet`, { userId });
      if (response.data.success) {
        console.log("response.data.success : ",response.data);
        
        setWalletData(response.data.data);
        console.log(response.data.data );
        
        setTransactions(response.data.data || []); // Assuming transactions are part of the response
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handlePay = async () => {
    try {
    
      
      // Create an order in the backend
      const orderResponse = await axiosInstance.post(`${BACKEND_SERVER}/createOrder`, { amount });
      const { id: order_id, currency } = orderResponse.data;

      // Integrate with Razorpay
      const options = {
        key: import.meta.env.RAZORPAY_KEY_ID, // Use your Razorpay Key ID from environment variables
        amount: amount * 100, // in paise
        currency: currency,
        name: 'Talk To Pro',
        description: 'Add money to wallet',
        order_id: order_id,
        handler: async (response) => {
          const paymentData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: amount,
            id: user.userid,
          };

        
          const verifyResponse = await axiosInstance.post(`${BACKEND_SERVER}/verifyPayment`, paymentData);
     
          
          if (verifyResponse.data.message === 'Payment verified successfully') {
            fetchWalletData(); 
          } else {
            alert('Payment verification failed!');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#0e3a4a',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.log('Error during payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const totalAmount = walletData.length > 0 ? walletData[0].totalAmount : 0;

  return (
    <div className="relative h-screen w-screen">
      <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-10">
        <Navbar />
      </div>
      <div
        className={`transition-transform duration-500 ease-in-out ${
          showTransactions ? 'translate-x-[-50%]' : 'translate-x-0'
        } w-full h-full bg-gray-100`}
        style={{ marginTop: '4rem' }} // Adjust margin to accommodate the fixed navbar height
      >
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <div className="w-full max-w-xl p-6 bg-white border-b-4 border-[#ae8b35] shadow-lg max-h-[100px]">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FaWallet size={30} style={{ marginRight: '20px' }} />
                <span className="text-lg font-bold">My Wallet</span>
              </div>
              <div className="text-lg">
                <span className="font-bold">Wallet Balance :</span> {totalAmount} rs
              </div>
            </div>
          </div>
          <div className="mt-10 p-6 bg-[#ae8b35] rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold text-center text-[#0e3a4a]">ADD MONEY TO WALLET</h2>
            <div className="mt-6 flex justify-center">
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                className="w-3/4 p-2 text-lg text-center bg-white rounded-full outline-none"
              />
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handlePay}
                className="bg-[#0e3a4a] text-white px-6 py-2 rounded-full text-lg font-bold"
              >
                PAY
              </button>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => setShowTransactions(!showTransactions)}
              className="bg-[#0e3a4a] text-white px-4 py-2 rounded-full text-sm"
            >
              {showTransactions ? 'Back' : 'Show Transactions >'}
            </button>
          </div>
        </div>
      </div>
      <TransactionModal
        isOpen={showTransactions}
        onClose={() => setShowTransactions(false)}
        transactions={transactions}
      />
    </div>
  );
};

export default Wallet;
