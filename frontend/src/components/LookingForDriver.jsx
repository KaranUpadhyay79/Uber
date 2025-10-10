import React from 'react'

function LookingForDriver(props) {
  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <h5 className="p-1 text-center w-[93%] absolute top-0" onClick={() => props.setVehicleFound(false)}>
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-fill"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Looking for a Driver</h3>
      {/* Loading spinner */}
      <div className="flex flex-col items-center justify-center my-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black mb-4"></div>
        <span className="text-gray-600 text-lg">Searching nearby captains...</span>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
        <img className="h-30" src="https://mobile-content.uber.com/launch-experience/ride.png" alt='car' />
        <div className="w-full mt-5">
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="h-10 text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{props.pickup}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="h-10 text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">{props.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 ">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.fare[props.vehicleType]}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LookingForDriver

