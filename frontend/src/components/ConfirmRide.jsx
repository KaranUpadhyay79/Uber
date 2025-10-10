import React from 'react'

const ConfirmRide = (props) => {
  return (
    <div>
         <h5 className="p-1 text-center w-[93%] absolute top-0 " onClick={()=>{
              props.setVehiclePanelOpen(false)
          }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-fill"></i></h5>
           <h3 className="text-2xl font-semibold mb-5">Confirm your Ride</h3>
           
           <div className="flex gap-2 justify-between flex-col items-center">
            <img className="h-30" src="https://mobile-content.uber.com/launch-experience/ride.png" alt='car'/>
           <div className="w-full mt-5">
              <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="h-10 text-lg ri-map-pin-user-fill"></i>
                    <div>
                      <h3 className="text-lg font-medium">562/11-A</h3>
                      <p className="text-sm -mt-1 text-gray-600">{props.pickup}</p>
                    </div>
              </div>
              <div className="flex items-center gap-5 p-3 border-b-2">
                    <i className="h-10 text-lg ri-map-pin-2-fill"></i>
                    <div>
                      <h3 className="text-lg font-medium">562/11-A</h3>
                      <p className="text-sm -mt-1 text-gray-600">{props.destination}</p>
                    </div>
              </div>
              <div className="flex items-center gap-5 p-3 ">
                   <i className="ri-currency-line"></i>
                    <div>
                      <h3 className="text-lg font-medium">₹{props.fare[props.vehicleType]}</h3>
                      <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
                    </div>
              </div>
           </div>
           <button onClick={()=>{
            props.setVehicleFound(true);
            props.setConfirmRidePanel(false) 
            props.createRide();
           }}className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg">Confirm</button>
           </div>
    </div>
  )
}

export default ConfirmRide


// import React from 'react'

// const ConfirmRide = (props) => {
//   return (
//     <div>
//       <h5 className="p-1 text-center w-[93%] absolute top-0" onClick={()=>{
//         props.setVehiclePanelOpen && props.setVehiclePanelOpen(false)
//       }}>
//         <i className="text-3xl text-gray-200 ri-arrow-down-wide-fill"></i>
//       </h5>

//       <h3 className="text-2xl font-semibold mb-5">Confirm your Ride</h3>

//       <div className="flex gap-2 justify-between flex-col items-center">
//         <img className="h-30" src="https://mobile-content.uber.com/launch-experience/ride.png" alt='car'/>

//         <div className="w-full mt-5">
//           <div className='flex items-center gap-5 p-3 border-b-2'>
//             <i className="h-10 text-lg ri-map-pin-user-fill"></i>
//             <div>
//               <h3 className="text-lg font-medium">Pickup</h3>
//               <p className="text-sm -mt-1 text-gray-600">{props.pickup ?? '...'}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-5 p-3 border-b-2">
//             <i className="h-10 text-lg ri-map-pin-2-fill"></i>
//             <div>
//               <h3 className="text-lg font-medium">Destination</h3>
//               <p className="text-sm -mt-1 text-gray-600">{props.destination ?? '...'}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-5 p-3 ">
//             <i className="ri-currency-line"></i>
//             <div>
//               <h3 className="text-lg font-medium">
//                 ₹{props.fare && props.vehicleType ? props.fare[props.vehicleType] ?? 0 : 0}
//               </h3>
//               <p className="text-sm -mt-1 text-gray-600">Cash</p>
//             </div>
//           </div>
//         </div>

//         <button onClick={()=>{
//           props.setVehicleFound && props.setVehicleFound(true);
//           props.setConfirmRidePanel && props.setConfirmRidePanel(false);
//           props.createRide && props.createRide();
//         }} className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg">
//           Confirm
//         </button>
//       </div>
//     </div>
//   )
// }

// export default ConfirmRide
