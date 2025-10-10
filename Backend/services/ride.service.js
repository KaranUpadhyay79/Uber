const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');


async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error('Pickup and destination are required');
  }

  const distanceTime = await mapService.getDistanceTime(pickup, destination);
  //console.log("Raw distanceTime:", distanceTime);

  const distanceKm = distanceTime.distance.value / 1000;
  const timeMin = distanceTime.duration.value / 60;

  // Base fares (can keep same or adjust if needed)
  const baseFare = {
    auto: 30,
    car: 50,
    motorcycle: 20,
  };

  // Updated per KM rates as per your new info
  const perKmRate = {
    auto: 5,
    car: 10,
    motorcycle: 3,
  };

  // Per Minute rates (kept same, change if you want)
  const perMinuteRate = {
    auto: 2,
    car: 3,
    motorcycle: 1.5,
  };

  // Minimum fare for each vehicle
  const minFare = {
    auto: 50,
    car: 75,
    motorcycle: 30,
  };

  function roundToNearestFive(num) {
    return Math.round(num / 5) * 5;
  }

  function calculateFare(base, distKm, perKm, timeMin, perMin, minF) {
    const fare = base + distKm * perKm + timeMin * perMin;
    return Math.max(roundToNearestFive(fare), minF);
  }

  const fare = {
    auto: calculateFare(baseFare.auto, distanceKm, perKmRate.auto, timeMin, perMinuteRate.auto, minFare.auto),
    car: calculateFare(baseFare.car, distanceKm, perKmRate.car, timeMin, perMinuteRate.car, minFare.car),
    motorcycle: calculateFare(baseFare.motorcycle, distanceKm, perKmRate.motorcycle, timeMin, perMinuteRate.motorcycle, minFare.motorcycle),
  };

  //console.log("Calculated fare:", fare);
  return fare;
}

module.exports.getFare = getFare;

function getOtp(num) {
  if (num <= 0) return '';
  const min = Math.pow(10, num - 1);
  const max = Math.pow(10, num) - 1;
  return crypto.randomInt(min, max + 1).toString();
}


module.exports.createRide = async ({ userId, pickup, destination, vehicleType }) => {
  if (!userId || !pickup || !destination || !vehicleType) {
    throw new Error('Missing required fields for creating a ride');
  }

  // Get fare details
  const fareDetails = await getFare(pickup, destination);

  // Choose fare based on vehicleType
  const selectedFare = fareDetails[vehicleType.toLowerCase()];
  if (!selectedFare) { 
    throw new Error('Invalid vehicle type');
  }

  // Create ride
  const ride = await rideModel.create({
    user: userId, // yahan sahi key use ho rahi hai
    pickup,
    destination,
    otp:getOtp(6),
    fare: selectedFare,
    status: 'pending',
  });

  return ride;
};

// module.exports.confirmRide = async ({ rideId, captain }) => {
//   if (!rideId || !captain) {
//     throw new Error('Ride ID and captain are required to confirm a ride');
//   }

//   const updateResult = await rideModel.findOneAndUpdate({
//     _id: rideId,
//     status: 'pending'
//   }, {
//     status: "accepted",
//     captain: captain._id
//   }, { new: true });

//   if (!updateResult) {
//     throw new Error('Ride not found or already confirmed');
//   }

//   const ride = await rideModel.findOne({
//     _id: rideId
//   }).populate('user').populate('captain');

//   if (!ride) {
//     throw new Error('Ride not found after update');
//   }

//   return ride;

// }

module.exports.confirmRide = async ({ rideId, captain }) => {
  if (!rideId || !captain) {
    throw new Error('Ride ID and captain are required to confirm a ride');
  }

  const updatedRide = await rideModel.findOneAndUpdate(
    { _id: rideId, status: 'pending' },
    { status: 'accepted', captain: captain._id },
    { new: true }
  );

  if (!updatedRide) {
    throw new Error('Ride not found or already confirmed');
  }

  const ride = await rideModel
    .findOne({ _id: rideId })
    .populate('user')
    .populate('captain');

  if (!ride) throw new Error('Ride not found after update');

  return ride;
};

// module.exports.confirmRide = async ({ rideId , captain}) => {
//   if (!rideId || !captain) {
//     throw new Error('Ride ID is required to confirm a ride');
//   }

//   await rideModel.findOneAndUpdate({
//     _id: rideId, captain
//   },{
//     status:"accepted",
//     captain:captain._id
//   })

//   const ride = await rideModel.findOne({
//     _id: rideId,
//   }).populate('user').populate('captain');

//   if(!ride) {
//     throw new Error('Ride not found');
//   }

//   return ride;
// }

// module.exports.confirmRide = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { rideId } = req.body;

//   try {
//     // 1. Ride confirm karna (service handle karega status + captain set)
//     const ride = await rideService.confirmRide({
//       rideId,
//       captain: req.captain,
//     });

//     // 2. Ride ko populate karo taaki user aur captain ka full data mile
//     const populatedRide = await rideModel
//       .findById(ride._id)
//       .populate("user")
//       .populate("captain");

//     // 3. Agar user ke paas socketId hai to real-time event bhejo
//     if (populatedRide.user && populatedRide.user.socketId) {
//       console.log("Sending ride-accepted to:", populatedRide.user.socketId);
//       sendMessageToSocketId(populatedRide.user.socketId, {
//         event: "ride-accepted",
//         data: populatedRide,
//       });
//     }else {
//   console.log("User socketId missing:", populatedRide.user);
// }

//     // 4. Captain ko bhi response bhejo
//     return res.status(200).json(populatedRide);
//   } catch (err) {
//     console.error("confirmRide error:", err);
//     return res.status(500).json({ message: err.message });
//   }
// };


