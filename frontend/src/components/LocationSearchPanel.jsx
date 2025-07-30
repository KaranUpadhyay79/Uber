// import React from 'react'

// const LocationSearchPanel = ({ suggestions = [], setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField }) => {

//     const handleSuggestionClick = (suggestion) => {
//         if (activeField === 'pickup') {
//             setPickup(suggestion)
//         } else if (activeField === 'destination') {
//             setDestination(suggestion)
//         }
//         // Optional: close panel after selection
//         // setVehiclePanel(true)
//         // setPanelOpen(false)
//     }

//     return (
//         <div>
//             {/* Check if suggestions exist */}
//             {suggestions.length > 0 ? (
//                 suggestions.map((elem, idx) => (
//                     <div
//                         key={idx}
//                         onClick={() => handleSuggestionClick(elem)}
//                         className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'>
//                         <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'>
//                             <i className="ri-map-pin-fill"></i>
//                         </h2>
//                         <h4 className='font-medium'>{elem}</h4>
//                     </div>
//                 ))
//             ) : (
//                 <p className='text-gray-400'>No suggestions available</p>
//             )}
//         </div>
//     )
// }

// export default LocationSearchPanel

import React from 'react'

const LocationSearchPanel = (props) => {

  const location = [
     "24B, Near Kapoor's cafe, Sheryians Coding School, Bhopal",
      "22C, Near Malholtra's cafe, Sheryians Coding School, Bhopal",
      "208, Near Singhai's cafe, Sheryians Coding School, Bhopal",
      "18A, Near Sharma's cafe, Sheryians Coding School, Bhopal",
  ]
  return (
    <div>
          {/*This is just a sample data */}
          {
            location.map(function(elem , idx){
              return <div key={idx}  onClick={()=>{
                props.setVehiclePanelOpen(true)
                props.setPanelOpen(false)
              }} className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'>
                <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'> <i className="ri-map-pin-fill"></i> </h2>
                <h4 className="font-medium">{elem}</h4>
              </div>
            })
          }
    </div>
  )
}

export default LocationSearchPanel