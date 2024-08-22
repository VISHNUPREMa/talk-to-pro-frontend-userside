import React, { useState, useContext, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import '../../style/slotbooking.css';
import ProfileContext from './context/profileContext';
import axiosInstance from '../../instance/axiosInstance';
import { BACKEND_SERVER } from '../../secrets/secret.js';
// import PayPalIntegration from './usercomponents/paypalComponent';
import Navbar from './usercomponents/navbar';
import { useData } from '../contexts/userDataContext.jsx';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

const Booking = () => {
  const MySwal = withReactContent(Swal);
  const { proProfile } = useContext(ProfileContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [fetchedSlots, setFetchedSlots] = useState([]);
  const [showPayPal, setShowPayPal] = useState(false);
  const [amount, setAmount] = useState(0);
  const { user } = useData();
  const proId = proProfile.userid;
  const dates = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i));

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'
  ];

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
       
        const response = await axiosInstance.post(`${BACKEND_SERVER}/getavailableslot`, { id: proId });
        if (response.data.success) {
          setFetchedSlots(response.data.data);
        } else {
          console.log("Error fetching available slots:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchAvailableSlots();
  }, [proProfile.userid]);

  useEffect(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const slot = fetchedSlots.find(slot => slot.date.startsWith(dateString));
    if (slot && selectedTimeSlot) {
      const foundSlot = slot.slots.find(s => s.time === selectedTimeSlot);
      if (foundSlot) {
        setAmount(foundSlot.amount);
      } else {
        setAmount(0);
      }
    } else {
      setAmount(0);
    }
  }, [selectedDate, selectedTimeSlot, fetchedSlots]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    try {
      if (amount > 0) {
        const orderResponse = await axiosInstance.post(`${BACKEND_SERVER}/createOrder`, { amount });
        const { id, currency } = orderResponse.data;
  
        const options = {
          key: import.meta.env.RAZORPAY_KEY_ID,
          amount: amount * 100, // amount in paise
          currency: currency,
          name: 'Talk To Pro',
          description: 'Book slot',
          order_id: id,
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
              alert("success");
  handlePaymentSuccess() 
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
  
        const rzp = new Razorpay(options);
        rzp.open();
  
      } else {
        setShowPayPal(true);
      }
    } catch (error) {
      console.error("Error handling payment:", error);
    }
  };
  
  
  const handlePaymentSuccess = async () => {
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
  }




  const getStatusForTimeSlot = (timeSlot) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const slot = fetchedSlots.find(slot => slot.date.startsWith(dateString));
    if (slot) {
      const foundSlot = slot.slots.find(s => s.time === timeSlot);
      if (foundSlot) {
        return foundSlot.status;
      }
    }
    return 'Available';
  };

  const toggleSelectedTimeSlot = (slot) => {
    if (getStatusForTimeSlot(slot) === 'Available' || getStatusForTimeSlot(slot) === 'Pending' || getStatusForTimeSlot(slot) === 'Cancelled') {
      if (selectedTimeSlot === slot) {
        setSelectedTimeSlot(null);
      } else {
        setSelectedTimeSlot(slot);
        const dateString = selectedDate.toISOString().split('T')[0];
        const dateSlot = fetchedSlots.find(slot => slot.date.startsWith(dateString));
        if (dateSlot) {
          const foundSlot = dateSlot.slots.find(s => s.time === slot);
          if (foundSlot) {
            setAmount(foundSlot.amount);
          }
        }
      }
    }
  };
  

  const handleSubscription = async () => {
    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        // Register the service worker

        // Ensure the service worker is active
        const serviceWorkerReg = await navigator.serviceWorker.ready;
        console.log('Service worker is active');

        let subscription = await serviceWorkerReg.pushManager.getSubscription();
        const url = '/sw.js';
        const reg = await navigator.serviceWorker.register(url, { scope: '/' });
        console.log('Service worker registered:', reg);

        if (!subscription) {
          subscription = await serviceWorkerReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BATvUXb1-YuDZFwAl4MAsPWJkTPLIf0r64s_ufJMGGh9XapE-F64PpWRIxPjSCDyPyByluwv3F3ZiyfRvWXWHAw',
          });
        }

        const subscriptionJSON = JSON.stringify(subscription);
        await axiosInstance.post(`${BACKEND_SERVER}/storePushNotification`, { 
          subscription: subscriptionJSON,
          id: user.userid 
        });
        
       

      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error during subscription:', error);
    }
  };

  useEffect(() => {
    handleSubscription();
  }, []);

  return (
    <div style={{ width: '100vw' }}>
      <div className="navbar-fixed">
        <Navbar />
      </div>
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 flex">
          <div className="w-2/3 pr-4">
            <h2 className="text-2xl font-bold mb-4">vishwas</h2>
            <h3 className="text-lg mb-6">Software-developer</h3>
            <div id="date-div">
              <div className="flex justify-between items-center mb-8">
                <button className="text-lg" onClick={() => setSelectedDate(subDays(selectedDate, 7))}>
                  &larr;
                </button>
                <div className="flex space-x-4">
                  {dates.map((date, index) => (
                    <button
                      key={index}
                      className={`p-4 rounded ${date.toDateString() === selectedDate.toDateString() ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                      onClick={() => handleDateChange(date)}
                    >
                      {format(date, 'EEE dd MMM')}
                    </button>
                  ))}
                </div>
                <button className="text-lg" onClick={() => setSelectedDate(addDays(selectedDate, 7))}>
                  &rarr;
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-8" style={{ marginTop: '40px' }}>
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  className={`p-3 rounded ${
                    selectedTimeSlot === slot
                      ? 'bg-green-500 text-white'
                      : getStatusForTimeSlot(slot) === 'Pending' 
                      ? 'bg-white border border-gray-400 text-gray-700'
                      : getStatusForTimeSlot(slot) === 'Booked'
                      ? 'bg-red-500 border border-gray-400 text-white'
                      : getStatusForTimeSlot(slot) === 'Cancelled'
                      ? 'bg-white border border-gray-400 text-gray-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => (getStatusForTimeSlot(slot) === 'Pending' ||getStatusForTimeSlot(slot) === 'Cancelled' )  && toggleSelectedTimeSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="w-1/3 pl-4 flex flex-col justify-between">
            <div className="flex-1"></div>
            <div id="legend" className="flex flex-col mb-6">
              <div className="flex items-center mb-1">
                <div className="w-4 h-3 bg-gray-200 mr-2"></div>
                <span>Unavailable</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-white border border-gray-400 mr-2"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-green-500 mr-2"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-red-500 mr-2"></div>
                <span>Booked</span>
              </div>
            </div>

            <div id="pay-btn">
            
                <button
                  onClick={handlePayNow}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded w-full"
                >
                  Pay Now
                </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
