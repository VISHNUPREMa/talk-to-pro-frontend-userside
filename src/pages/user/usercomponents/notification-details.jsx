import React from 'react';
import { useNotification } from '../customhooks/notification-hook';
import Navbar from './navbar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const NotificationDetails = () => {
  const navigate = useNavigate()
  const {singleNotification} = useNotification({});

  if (!singleNotification) {
    return <div>Loading...</div>;
  }
  const { time, status, amount, bookedBy,date,providedBy } = singleNotification;
  

  const parseDateTime = (dateStr, timeStr) => {
    const combinedDateTime = `${dateStr} ${timeStr}`;
    return new Date(Date.parse(combinedDateTime));
  };

  const handleCall = async () => {
    try {
      console.log("notification details : ",singleNotification);
      console.log([date , time, status, amount, bookedBy , providedBy]);
      const dateOnly = date.split('T')[0];
   
      const notificationDateTime = parseDateTime(date, time);
      const now = new Date();

const todayDate = now.toISOString().slice(0, 10);
console.log("notificationDateTime : ",dateOnly);
console.log("todayDate : ",todayDate);


const todayTime = now.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
}).replace(':', '.');

const getTimeComponents = (timeString) => {
  // Split the string by space to separate the time and period
  const [hourAndMinute, period] = timeString.split(' ');
  
  // Split the hour and minute part by dot and take only the hour
  const [hour] = hourAndMinute.split('.');

  return { hour, period: period.toLowerCase() };
};

const todayComponents = getTimeComponents(todayTime);
console.log("todayComponents : ",todayComponents);

const timeComponents = getTimeComponents(time);
console.log("timeComponents : ",timeComponents);

const todatTime = todayComponents.hour;
console.log("todatTime : ",todatTime);

const bookTime = timeComponents.hour.slice(0,2);
console.log("bookTime : ",bookTime);

  
     
if (todayDate === dateOnly) {
       
  if(todatTime === bookTime){
  navigate('/videocall',{state:{time:bookTime}})
  
        }else{
          Swal.fire({
            title: "The current time do not match the notification date .",
            text: "Please ensure you are trying to join the call at the scheduled date.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
          });
        }

  
      } else {
        console.log("The current date  do not match the notification date ");
        Swal.fire({
          title: "The current date  do not match the notification date .",
          text: "Please ensure you are trying to join the call at the scheduled date.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
        });
      }
    } catch (error) {
      Swal.fire({
        title: "An error occurred",
        text: error.message || "Something went wrong while trying to handle the call.",
        icon: "error",
        confirmButtonText: 'OK',
      });
      console.error("Error in handleCall:", error);
    }
  };
  

  return (
  <div style={{ width: '100vw' }}>
    <div className="navbar-fixed">
        <Navbar />
      </div>
 
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-semibold mb-6">Notification Details</h1>
          <div className="mb-6">
            <h2 className="text-2xl font-medium mb-3">Slot Details</h2>
            <p><strong>Time:</strong> {time}</p>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Amount:</strong> {amount}</p>
            <p><strong>Booked By:</strong> {bookedBy}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-medium mb-3">Provided By</h2>
            <p>{providedBy}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-medium mb-3">Date</h2>
            <p>{new Date(date).toLocaleDateString()}</p>
          </div>
          {status === 'Booked' ? <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleCall}>Call Now</button>
            </div>:null}
        </div>
      </div>
    </div>
    </div>
  );
};

export default NotificationDetails;
