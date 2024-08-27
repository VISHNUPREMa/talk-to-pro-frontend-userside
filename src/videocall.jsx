import React, { useRef, useEffect, useState } from "react";
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from "react-icons/fi";
import { FaPhone, FaTimes } from 'react-icons/fa';
import { io } from "socket.io-client";
import Swal from 'sweetalert2';
import { useData } from "./pages/contexts/userDataContext";
import Navbar from "./pages/user/usercomponents/navbar";
import { BACKEND_SERVER } from "./secrets/secret";
import axiosInstance from "./instance/axiosInstance";
import StarRating from "./pages/user/usercomponents/ratingStar";
import './style/starrating.css'
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';



const socket = io("http://localhost:3000", { transports: ["websocket"] });

const configuration = {
  iceServers: [
    { urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] },
  ],
  iceCandidatePoolSize: 10,
};

function App() {
 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useData();
  const userid = user.userid
  const room = '123456';
  const [toId , setToId] = useState('');
  const [customerId , setCustomerId] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [stars , setStars] = useState(null);
  const [bookingId , setBookingId] = useState('')
  const location = useLocation();
  const bookTime = location.state?.time;
 
  
useEffect(()=>{
  

  console.log("user id : ",userid);
socket.emit('on',{userid})
},[])









useEffect(() => {
  socket.emit('join', room);

  socket.on("calling", (data) => {
    if (!localStream.current) {
      console.log("not ready yet");
      return;
    }
    switch (data.type) {
      case "offer":
        handleOffer(data);
        break;
      case "answer":
        handleAnswer(data);
        break;
      case "candidate":
        handleCandidate(data);
        break;
      case "ready":
        if (pc.current) {
          alert("already in call ignoring");
          return;
        }
        makeCall();
        break;
      case "bye":
        if (pc.current) {
          hangup();
        }
        break;
      default:
        console.log("unhandled", data);
        break;
    }
  });

  socket.on('ignoredStatus', () => {
    alert("a")
    hangup();
    Swal.fire({
      title: 'Call ended',
    });
  });

  socket.on('chat-message', (data) => {
    const {message , fromId} = data
    alert("message")
    console.log("message fron other  : ",message);
    setMessages(prevMessages => [...prevMessages, { sender: fromId, message: message }]);
  });

  return () => {
    socket.off("calling");
    socket.off("ignoredStatus");
  };
}, [room]);

socket.on('cut-call', () => {
  Swal.fire({
    title: 'User cut the call',
    showCancelButton: true,
    confirmButtonText: 'Ok',
  }).then((result) => {
    if (result.isConfirmed) {
      console.log("User acknowledged the call was cut");
      hangup();
    }
  });
});

socket.on('review',()=>{
  Swal.fire({
    title: 'Do you finish the call?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'Reconnect',
  }).then((result) => {
    if (result.isConfirmed) {
   
      console.log("Call finished.");
      setShowRating(true);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      console.log("Reconnecting to the call...");
      startB()
    }
  });
  




})



  const pc = useRef(null);
  const localStream = useRef(null);
  const startButton = useRef(null);
  const hangupButton = useRef(null);
  const muteAudButton = useRef(null);
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const muteVideoButton = useRef(null);

  async function makeCall() {
    try {
   
      pc.current = new RTCPeerConnection(configuration);
      pc.current.onicecandidate = (e) => {
        const message = {
          type: "candidate",
          candidate: e.candidate ? e.candidate.candidate : null,
          sdpMid: e.candidate ? e.candidate.sdpMid : undefined,
          sdpMLineIndex: e.candidate ? e.candidate.sdpMLineIndex : undefined,
        };
        socket.emit("calling", { room, data: message });
      };
      pc.current.ontrack = (e) => (remoteVideo.current.srcObject = e.streams[0]);
      localStream.current.getTracks().forEach((track) => pc.current.addTrack(track, localStream.current));
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      socket.emit("calling", { room, data: { type: "offer", sdp: offer.sdp } });
    } catch (e) {
      console.log(e);
    }
  }

  async function handleOffer(offer) {
    if (pc.current) {
      console.error("existing peerconnection");
      return;
    }
    try {
      pc.current = new RTCPeerConnection(configuration);
      pc.current.onicecandidate = (e) => {
        if (e.candidate) {
          const message = {
            type: "candidate",
            candidate: e.candidate.candidate,
            sdpMid: e.candidate.sdpMid,
            sdpMLineIndex: e.candidate.sdpMLineIndex
          };
          socket.emit("calling", { room, data: message });
        }
      };
      
      pc.current.ontrack = (e) => (remoteVideo.current.srcObject = e.streams[0]);
      localStream.current.getTracks().forEach((track) => pc.current.addTrack(track, localStream.current));
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      console.log("room : ",room);
      
      socket.emit("calling", { room, data: { type: "answer", sdp: answer.sdp } });
    } catch (e) {
      console.log(e);
    }
  }

  async function handleAnswer(answer) {

    if (!pc.current) {
      console.error("no peerconnection");
      return;
    }
    try {
     
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (e) {
      console.log(e);
    }
  }

  async function handleCandidate(candidate) {
    try {
      if (!pc.current) {
        console.error("No peer connection");
        return;
      }
  
      const { candidate: iceCandidate, sdpMid, sdpMLineIndex } = candidate;
  
      if (iceCandidate && sdpMid !== null && sdpMLineIndex !== null) {
        await pc.current.addIceCandidate(new RTCIceCandidate({
          candidate: iceCandidate,
          sdpMid: sdpMid,
          sdpMLineIndex: sdpMLineIndex
        }));
      } else {
        console.error("Incomplete ICE candidate received", candidate);
      }
    } catch (e) {
      console.log("Error handling ICE candidate:", e);
    }
  }
  

  async function hangup(callend) {
 
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }
    startButton.current.disabled = false;
    hangupButton.current.disabled = true;
    muteAudButton.current.disabled = true;
    muteVideoButton.current.disabled = true; // Use muteVideoButton here
    if(callend){
      socket.emit('review',{room,customerId})
    }
  }

  useEffect(() => {
    hangupButton.current.disabled = true;
    muteAudButton.current.disabled = true;
    muteVideoButton.current.disabled = true; // Use muteVideoButton here
  }, []);

  const [audioState, setAudio] = useState(true);
  const [videoState, setVideoState] = useState(true);

async function startB() {
  
  try {

    const id = user.userid;
    console.log("id : ",id);
    
    const response = await axiosInstance.post(`${BACKEND_SERVER}/call`, { id });
    if (response.data.success) {
      console.log("response : ",response);
      
      
      setCustomerId(response.data.message)
      setToId(response.data.data.id);
      setBookingId(response.data.data.bookid);
      
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: { echoCancellation: true },
      });
      localVideo.current.srcObject = localStream.current;
      console.log("room : ",room);
      console.log("id : ",id);
      console.log("response.data.data.id : ",response.data.data.id);
      
      socket.emit("call-request", { room, from: id, to: response.data.data.id });
    }else{
      toast.error(response.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  } catch (err) {
    console.log(err);
  }

  startButton.current.disabled = true;
  hangupButton.current.disabled = false;
  muteAudButton.current.disabled = false;
  muteVideoButton.current.disabled = false;

  socket.emit("calling", { room, data: { type: "ready" } });
}


  const hangB = async () => {
    Swal.fire({
      title: 'Are you sure you want to end the call?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((res) => {
      if (res.isConfirmed) {
        hangup({callend:true});
        socket.emit("calling", { room, data: { type: "bye" } });
      }
    });
  };

  function muteAudio() {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled; // Toggle mute/unmute
      });
      setAudio(!audioState); // Update state for UI toggle
    }
  }

  function pauseVideo() {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled; 
      });
      setVideoState(!videoState); 
    }
  }

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("chat-message", { room, message: newMessage, sender: user.userid });
      setMessages([...messages, { sender: user.userid, message: newMessage }]);
      setNewMessage("");
    }
  };

  const handleRating = (rating) => {
  
    console.log(`User clicked on ${rating} star(s)`);
    setStars(rating)
  };

  const handleCloseRating = async()=>{
    try {
      setShowRating(false);
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleRateNow = async()=>{
    try {
     const response = await axiosInstance.put(`${BACKEND_SERVER}/rating`,{stars,toId,bookingId,bookTime});
     if(response.data.success){
      console.log("response of rating : ",response);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
     
      
     }
      
     setShowRating(false);
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
   
    <div className='bg-white w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center'>
      <div className='flex flex-col md:flex-row items-center justify-center'>
        <div className='flex flex-col items-center space-y-4 md:space-y-8'>
          <div className='bg-gray-200 h-96 w-full md:w-96 rounded-lg shadow-md'>
            <video ref={localVideo} className='w-full h-full rounded-lg object-cover' autoPlay playsInline muted></video>
          </div>
        </div>
        <div className='flex flex-col items-center space-y-4 md:space-y-8 md:ml-8'>
          <div className='bg-gray-200 h-96 w-full md:w-96 rounded-lg shadow-md'>
            <video ref={remoteVideo} className='w-full h-full rounded-lg object-cover' autoPlay playsInline></video>
          </div>
        </div>
      </div>
      <div className='flex space-x-4 absolute bottom-10'>
        <button onClick={startB} ref={startButton} className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'>
          <FaPhone className='h-5 w-5' />
        </button>
        <button onClick={hangB} ref={hangupButton} className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600'>
          <FaTimes className='h-5 w-5' />
        </button>
        <button onClick={muteAudio} ref={muteAudButton} className={`bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 ${!audioState ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'}`}>
          {audioState ? <FiMic className='h-5 w-5' /> : <FiMicOff className='h-5 w-5' />}
        </button>
        <button onClick={pauseVideo} ref={muteVideoButton} className={`bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 ${!videoState ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'}`}>
          {videoState ? <FiVideo className='h-5 w-5' /> : <FiVideoOff className='h-5 w-5' />}
        </button>
      </div>
      <div className='absolute right-0 top-10  w-80 bg-white shadow-md border-l border-gray-300 flex flex-col overflow-x-hidden' style={{ height: '95%' }}>
        <div className='flex-grow overflow-y-auto p-4'>
          <div className='mb-4 text-lg font-bold'>Chat</div>
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === user.userid ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded ${msg.sender === user.userid ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'}`}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>
        <div className='p-4 border-t border-gray-300'>
          <input
            type='text'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Type a message...'
            className='w-full p-2 border border-gray-300 rounded'
            onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
          />
          <button onClick={sendMessage} className='w-full mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>
            Send
          </button>
        </div>
        </div>
        {showRating && (
        <div className="rating-container">
          
        <IoMdClose size={35} id="close-rating" onClick={handleCloseRating} />
          <h2>Please rate your call</h2>
          <StarRating onRating={handleRating} />
          
          <button id="rate-btn" onClick={handleRateNow}>Rate Now</button>
        </div>
      )}
        

    </div>
    </div>
     
  );
}

export default App;
