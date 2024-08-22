import React, { useEffect, useState } from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import axiosInstance from '../../../instance/axiosInstance';
import { BACKEND_SERVER } from '../../../secrets/secret';
import { useData } from '../../../pages/contexts/userDataContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import '../../../style/slotbooking.css';

const PayPalIntegration = ({ amount, selectedDate, selectedTimeSlot, proId }) => {
  const { user } = useData();
  const [usdAmount, setUsdAmount] = useState(null);
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch the conversion rate from INR to USD
    const fetchConversionRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const conversionRate = data.rates.USD;
        setUsdAmount((amount * conversionRate).toFixed(2));
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };

    fetchConversionRate();
  }, [amount]);

  const handlePaymentSuccess = async (details, data) => {
    const userid = user.userid;
    try {
      const response = await axiosInstance.post(`${BACKEND_SERVER}/bookslot`, {
        userid,
        amount,
        selectedDate,
        selectedTimeSlot,
        proId,
      });

      if (response.data) {
        console.log(response.data);
        MySwal.fire({
          title: 'Booked',
          text: 'The slot was booked successfully.',
          icon: 'success',
          customClass: {
            popup: 'swal2-popup',
            title: 'swal2-title',
            content: 'swal2-content',
            confirmButton: 'swal2-confirm',
          },
        })
        .then((result) => {
          if (result.isConfirmed) {
            navigate("/")
          }
        })
      }
    } catch (error) {
      console.error('Error during booking:', error);
      MySwal.fire({
        title: 'Error',
        text: 'An error occurred during the booking. Please try again.',
        icon: 'error',
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          content: 'swal2-content',
          confirmButton: 'swal2-confirm',
        },
      });
    }
  };

  return (
    <div>
      {usdAmount ? (
        <div>
          <p>Amount: ₹{amount} (USD {usdAmount})</p>
          <PayPalButton
            amount={usdAmount}
            onSuccess={handlePaymentSuccess}
            onError={(err) => {
              console.error('Error during transaction:', err);
              MySwal.fire({
                title: 'Error',
                text: 'An error occurred during the transaction. Please try again.',
                icon: 'error',
                customClass: {
                  popup: 'swal2-popup',
                  title: 'swal2-title',
                  content: 'swal2-content',
                  confirmButton: 'swal2-confirm',
                },
              });
            }}
            options={{
              clientId: 'Aa7HpxlA1B6uxmasFbRX6ecqt3hkSU2ujusNiVBbUzieVqpYXLfu6Pu82154ZQu5xPcSIFGzQu8k4inc',
              currency: 'USD',
            }}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PayPalIntegration;
