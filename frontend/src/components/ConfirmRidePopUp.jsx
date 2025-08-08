import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ConfirmRidePopUp = (props) => {
  const [otp , setOtp] = useState('')

  const submitHandler = (e) => {
    e.preventDetault();
  }

  return (
     <div>
          <h5 className="p-1 text-center w-[93%] absolute top-0 " onClick={()=>{
              props.setConfirmRidePopupPanel(false)
          }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-fill"></i></h5>
           <h3 className="text-2xl font-semibold mb-5">Confirm this ride to Start</h3>
           <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
              <div className='flex items-center gap-3'>
                <img className="h-12 w-10 rounded-full object-cover" src="data:image/jpeg;base64,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" alt="Image"/>
                <h2 className="text-lg font-medium">Harshi Pateliya</h2>
              </div>
              <h5 className='text-lg font-semibold'>2.2 KM</h5>
           </div>
           
           <div className="flex gap-2 justify-between flex-col items-center">

           <div className="w-full mt-5">
              <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="h-10 text-lg ri-map-pin-user-fill"></i>
                    <div>
                      <h3 className="text-lg font-medium">562/11-A</h3>
                      <p className="text-sm -mt-1 text-gray-600">Kankariya Talab , Bhopal</p>
                    </div>
              </div>
              <div className="flex items-center gap-5 p-3 border-b-2">
                    <i className="h-10 text-lg ri-map-pin-2-fill"></i>
                    <div>
                      <h3 className="text-lg font-medium">562/11-A</h3>
                      <p className="text-sm -mt-1 text-gray-600">Kankariya Talab , Bhopal</p>
                    </div>
              </div>
              <div className="flex items-center gap-5 p-3 ">
                   <i className="ri-currency-line"></i>
                    <div>
                      <h3 className="text-lg font-medium">₹193.20</h3>
                      <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
                    </div>
              </div>
           </div>
           <div className='m-6  w-full'>
             <form onSubmit={()=>{
                 submitHandler(e);
             }}>
                  <input value={otp} onChange={(e)=>setOtp(e.target.value)} type="text" className='bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-3' placeholder='Enter OTP'/>

                <Link to="/captain-riding" className="w-full mt-5 flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg">Confirm</Link>

                <button onClick={()=>{
                 props.setConfirmRidePopupPanel(false)
                 props.setRidePopupPanel(false)

                 }}className="w-full mt-1 bg-red-600 text-white font-semibold p-3 rounded-lg">Cancel</button>
              </form>
           </div>

        </div>

           
    </div>
  )
}

export default ConfirmRidePopUp