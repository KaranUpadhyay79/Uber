import React from 'react';

const LocationSearchPanel = ({ suggestions = [], onSuggestionClick, setPanelOpen, setVehiclePanelOpen }) => {
  return (
    <div className="p-3">
      {suggestions.length === 0 ? (
        <div className="text-gray-400 text-center">No suggestions found.</div>
      ) : (
        suggestions.map((loc, idx) => (
          <div
            key={idx}
            className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start cursor-pointer'
            onClick={() => {
              if (onSuggestionClick) onSuggestionClick(loc);
              // setPanelOpen(false);
              // setVehiclePanelOpen(true);
            }}
          >
            <h2 className="bg-[#eee] h-8 w-12 flex items-center justify-center rounded-full">
              <i className="ri-map-pin-fill"></i>
            </h2>
            <h4 className="font-medium">{loc}</h4>
          </div>
        ))
      )}
    </div>
  );
};

export default LocationSearchPanel;


