import React , {useState , useRef, useEffect } from 'react'

import axios from "axios";
import {useGSAP} from '@gsap/react';
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import {SocketContext} from '../context/SocketContext';
import {useContext} from 'react';
import {UserDataContext} from '../context/UserContext';



const Home = () => {
  const [pickup , setPickup] = useState('')
  const [destination , setDestination] = useState('')
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(''); // 'pickup' or 'destination'
  const [panelOpen , setPanelOpen] = useState(false)
  const vehicalPanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)

  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)
  const [vehicalPanelOpen , setVehiclePanelOpen] = useState(false);
  const [confirmRidePanel , setConfirmRidePanel] = useState(false);
  const [vehicleFound , setVehicleFound] = useState(false);
  const [lookingForDriver, setLookingForDriver] = useState(false);
  const [waitingForDriver , setWaitingForDriver] = useState(false)
  const [fare , setFare] = useState({});
  const [vehicleType , setVehicleType] = useState(null);
  const {sendMessage, receiveMessage} = useContext(SocketContext);
  const {user} = useContext(UserDataContext);
  const [ride , setRide] = useState(null);

  // useEffect(() => {
  // // Fallback polling: check ride status every 3 seconds if still waiting
  // let pollInterval = null;
  // if (vehicleFound && !waitingForDriver && ride && ride._id) {
  //   pollInterval = setInterval(async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/status`, {
  //         params: { rideId: ride._id },
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       if (response.data.status === 'accepted') {
  //         setRide(response.data.ride);
  //         setVehicleFound(false);
  //         setWaitingForDriver(true);
  //         clearInterval(pollInterval);
  //       }
  //     } catch (err) {
  //       // Ignore errors
  //     }
  //   }, 3000);
  // }
  // // Cleanup: remove listener and polling on unmount
  // return () => {
  //   if (pollInterval) clearInterval(pollInterval);
  //   // If your socket context supports off, use it here
  //   // socket.off("ride-accepted", handler);
  // };
  //   console.log(user);
  //   sendMessage("join", {userType: 'user', userId: user._id});
  // },[user])

//   useEffect(() => {
//   receiveMessage('ride-confirmed', (ride) => {
//     setVehicleFound(false);
//     setWaitingForDriver(true);
//     setRide(ride);
//   });
// }, [receiveMessage]);
useEffect(() => {
  receiveMessage("ride-accepted", (ride) => {
    console.log("✅ Captain accepted the ride:", ride);

    setRide(ride);
    setVehicleFound(false);     // close LookingForDriver.jsx
    setWaitingForDriver(true);  // open WaitingForDriver.jsx
  });
}, [receiveMessage]);



  const submitHandler = (e) => {
  e.preventDefault()
  }

  // Handlers for pickup and destination input changes
  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);
    setActiveField('pickup');
    const trimmed = value.trim();
    // Only send request if input length >= 3
    if (!trimmed || trimmed.length < 3) {
      setPickupSuggestions([]);
      return;
    }
    try {
      const axios = (await import('axios')).default;
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input: trimmed },
        headers: { Authorization: `Bearer ${token}` }
      });
      // Accept both array and object response
      let suggestionsArr = Array.isArray(response.data)
        ? response.data
        : response.data.suggestions || [];
      // If suggestion is an object, map to description
      if (suggestionsArr.length && typeof suggestionsArr[0] === 'object' && suggestionsArr[0].description) {
        setPickupSuggestions(suggestionsArr.map(s => s.description));
      } else {
        setPickupSuggestions(suggestionsArr);
      }
    } catch (err) {
      console.error('Pickup suggestion error:', err);
      setPickupSuggestions([]);
    }
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
    setActiveField('destination');
    const trimmed = value.trim();
    // Only send request if input length >= 3
    if (!trimmed || trimmed.length < 3) {
      setDestinationSuggestions([]);
      return;
    }
    try {
      const axios = (await import('axios')).default;
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input: trimmed },
        headers: { Authorization: `Bearer ${token}` }
      });
      let suggestionsArr = Array.isArray(response.data)
        ? response.data
        : response.data.suggestions || [];
      if (suggestionsArr.length && typeof suggestionsArr[0] === 'object' && suggestionsArr[0].description) {
        setDestinationSuggestions(suggestionsArr.map(s => s.description));
      } else {
        setDestinationSuggestions(suggestionsArr);
      }
    } catch (err) {
      console.error('Destination suggestion error:', err);
      setDestinationSuggestions([]);
    }
  };

  useGSAP(function() {
    if (panelRef.current) {
      if(panelOpen){
        gsap.to(panelRef.current,{
          height:"70%",
          padding:24
        });
      }else{
        gsap.to(panelRef.current,{
          height:'0%',
          padding:0
        });
      }
    }
    if (panelCloseRef.current) {
      if(panelOpen){
        gsap.to(panelCloseRef.current,{
          opacity:1
        })
      }else{
        gsap.to(panelCloseRef.current,{
          opacity:0
        })
      }
    }
  },[panelOpen])

  // Animate panels
  useGSAP(function() {
    if (vehicalPanelRef.current) {
      if (vehicalPanelOpen) {
        gsap.to(vehicalPanelRef.current, {
          transform: 'translateY(0%)'
        })
      } else {
        gsap.to(vehicalPanelRef.current, {
          transform: 'translateY(100%)'
        })
      }
    }
  },[vehicalPanelOpen])

  useGSAP(function() {
    if (confirmRidePanelRef.current) {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: 'translateY(0%)'
        })
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: 'translateY(100%)'
        })
      }
    }
  },[confirmRidePanel])

  useGSAP(function() {
    if (vehicleFoundRef.current) {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: 'translateY(0%)'
        })
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: 'translateY(100%)'
        })
      }
    }
  },[vehicleFound])

  useGSAP(function() {
    if (waitingForDriverRef.current) {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: 'translateY(0%)'
        })
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: 'translateY(100%)'
        })
      }
    }
  },[waitingForDriver])

  
  const handleSuggestionClick = (suggestion) => {
    if (activeField === 'pickup') {
      setPickup(suggestion);
      setPickupSuggestions([]);
    } else if (activeField === 'destination') {
      setDestination(suggestion);
      setDestinationSuggestions([]);
    }
    //setPanelOpen(false); //Isko hum change kiye hai 
  };

  async function findTrip() {
    setVehiclePanelOpen(true);
    setPanelOpen(false);

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
      params: { pickup, destination },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    setFare(response.data); 
    
  }

  // async function createRide() {
  //   const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
  //     pickup,
  //     destination,
  //     vehicleType
  //   },{
  //     headers: { 
  //       Authorization: `Bearer ${localStorage.getItem('token')}`
  //     }
  //   })
  //   console.log(response.data);
  //   setRide(response.data.ride);  // ride ka data save karo
  //   setWaitingForDriver(true);        // ab LookingForDriver page show hoga
  // }

  async function createRide() {
  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
    pickup,
    destination,
    vehicleType
  }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  //console.log(response.data);
  setRide(response.data.ride);
  

  // ✅ Sirf LookingForDriver dikhao abhi
  setVehicleFound(false);
  setWaitingForDriver(true);
  
}


//    // socket se captain acceptance suno
//   useEffect(() => {
//   receiveMessage("ride-accepted", (data) => {
//     console.log("Captain accepted ride", data);
//     setRide(data);                // ✅ ride update karo
//     setWaitingForDriver(true);    // ✅ WaitingForDriver panel dikhao
//     setVehicleFound(false);       // ✅ LookingForDriver band karo
//   });
// }, [receiveMessage]);

  return (
    <div className='h-screen relative overflow-hidden'>
      <img
          className='w-16 absolute left-5 top-5'
          src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
          alt='Uber Logo'
        /> 
        <div className='h-screen w-screen'>
          <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"/>
        </div>
        <div className='flex flex-col justify-end h-screen absolute top-0 w-full p-0'>
            <div className='h-[30%] p-6 bg-white relative'>

              <h5 ref={panelCloseRef} onClick={()=>{
                setPanelOpen(false)
              }} className="absolute opacity-0 right-6 top-6 text-2xl">
                <i className="ri-arrow-down-wide-line"></i>
              </h5>
              <h4 className='text-2xl font-semibold'>Find a trip</h4>
            <form onSubmit={(e)=>{submitHandler(e)}}>
               <div className="Line absolute h-16 w-1 top-[45%] left-10 bg-gray-900 rounded-full"></div>
               <input
                  onClick={() => {
                    setPanelOpen(true);
                    setActiveField('pickup');
                  }}
                  value={pickup}
                  onChange={handlePickupChange}
                  className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5' 
                  type="text" 
                  placeholder='Add a pick-up location'/>
                <input 
                  onClick={() => {
                    setPanelOpen(true);
                    setActiveField('destination');
                  }}
                  value={destination}
                  onChange={handleDestinationChange}
                  className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3' 
                  type="text"
                  placeholder='Add your destination'/>
            </form>

            <button
               onClick={findTrip}
               className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full">
               Find Trip
            </button>

            </div>
            <div ref={panelRef} className=' bg-white h-0'>
                <LocationSearchPanel
                  suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                  onSuggestionClick={handleSuggestionClick}
                  setPanelOpen={setPanelOpen}
                  setVehiclePanelOpen={setVehiclePanelOpen}
                />
            </div>
        </div>
          <div ref={vehicalPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
              <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanelOpen={setVehiclePanelOpen}/>
          </div>
           <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
              <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound}  setVehiclePanelOpen={setVehiclePanelOpen}/>
           </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
               <LookingForDriver createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} setLookingForDriver={setLookingForDriver} 
               setWaitingForDriver={setWaitingForDriver} setRide={setRide} socket={receiveMessage} />
           </div>
           <div ref={waitingForDriverRef}  className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
               <WaitingForDriver  
               ride={ride}
               setVehicleFound={setVehicleFound}
               setWaitingForDriver={setWaitingForDriver}
               waitingForDriver={waitingForDriver}
               />
           </div>  
    </div>
  )
}

export default Home



