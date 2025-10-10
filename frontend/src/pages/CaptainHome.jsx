import React, { useState, useRef } from 'react';
import {Link} from 'react-router-dom'; 
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import { useEffect, useContext } from 'react';
import {SocketContext} from '../context/SocketContext';
import { CaptainDataContext } from "../context/CaptainContext";
import axios from 'axios';


const CaptainHome = () => {
  const [ridePopupPanel , setRidePopupPanel] = useState(false)
  const [ConfirmRidePopupPanel , setConfirmRidePopupPanel] = useState(false);

  const ridePopupPanelRef = useRef(null)
  const confirmRidePopupPanelRef = useRef(null)
  const [ride, setRide] = useState(null);

  const {socket} = useContext(SocketContext);
  const {captain} = useContext(CaptainDataContext);
  const { sendMessage } = useContext(SocketContext);


    useEffect(() => {
  if (!captain?._id) return;
  sendMessage('join', { userId: captain._id, userType: 'captain' });
}, [captain]);



// socket.on('new-ride', (data) => {
//   console.log("New ride received", data);
// })
useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
      console.log("🚖 New ride received:", data);
      // yaha tum ridePopupPanel state update bhi kar sakte ho agar chaho
      setRide(data);
      setRidePopupPanel(true);
    };

    socket.on("new-ride", handleNewRide);

    return () => {
      socket.off("new-ride", handleNewRide); // cleanup on unmount
    };
  }, [socket]);

  async function confirmRide() {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride._id,
        captainId: captain._id,
      },
      {
        headers: {
          Authorization: `Bearer ${captain.token}`,
        },
      }
    );

    console.log("✅ Ride confirmed:", response.data);

    // Popups handle
    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);

     socket.emit("ride-accepted", {
      rideId: ride._id,
      userId: ride.user._id,  // important
      ride: response.data,    // ride info including OTP, captain details
    });

  } catch (error) {
    console.error("❌ Error confirming ride:", error);
  }
}


  useGSAP(function() {
       if (ridePopupPanel) {
           gsap.to(ridePopupPanelRef.current, {
           transform: 'translateY(0%)'
        })
       } else {
           gsap.to(ridePopupPanelRef.current, {
           transform: 'translateY(100%)'
        })
       }

   } ,[ridePopupPanel ])

    useGSAP(function() {
       if (ConfirmRidePopupPanel) {
           gsap.to(confirmRidePopupPanelRef.current, {
           transform: 'translateY(0%)'
        })
       } else {
           gsap.to(confirmRidePopupPanelRef.current, {
           transform: 'translateY(100%)'
        })
       }

   } ,[ConfirmRidePopupPanel])

  return (
    <div className='h-screen'>
        <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
            <img className='w-16'src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' alt='Uber Logo'/>

            <Link to='/captain-login' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
            <i className=" text-lg font-medium ri-logout-box-r-line"></i>
            </Link>

        </div>
        <div className="h-3/5">
           <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"/>

        </div>
        <div className='h-2/5 p-6'>
            <CaptainDetails/>
        </div>

        <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
              <RidePopUp 
              ride={ride}
              setRidePopupPanel={setRidePopupPanel} 
              setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
              confirmRide={confirmRide}
              />
        </div>

         <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
              <ConfirmRidePopUp setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel}/>
        </div>
    </div>
  )
}

export default CaptainHome