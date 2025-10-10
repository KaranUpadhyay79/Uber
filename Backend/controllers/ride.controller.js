module.exports.getRideStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { rideId } = req.query;
  try {
    const ride = await rideModel.findById(rideId).populate('user').populate('captain');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    return res.status(200).json({ status: ride.status, ride });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const {sendMessageToSocketId} = require('../socket');
const rideModel = require('../models/ride.model');
const User = require('../models/user.model'); 


// module.exports.createRide = async (req, res) => {
//   // Validate request
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { pickup, destination, vehicleType } = req.body;

// try {
//   const ride = await rideService.createRide({
//     userId: req.user._id, // authMiddleware se aaya user
//     pickup,
//     destination,
//     vehicleType,
//   });
  
//   res.status(201).json(ride);

//   const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

//   console.log(" Coodinate ", pickupCoordinates);

//   const captainInRadius = await mapService.getCaptainsInTheRadius()
   
// } catch (err) {
//   return res.status(500).json({ message: err.message });
// }

// };

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      userId: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    // Get coordinates after ride creation
    const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
    console.log("pickupCoordinates", pickupCoordinates);

    const captainInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 20000); // 2 km radius
    console.log("captainInRadius", captainInRadius);

    ride.otp=""

    const ridewithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

    captainInRadius.map(captain => {
      //console.log(captain,ride);
    sendMessageToSocketId(captain.socketId, {
        event: 'new-ride',
        data: ridewithUser
    });
});
    // Finally, send response
    return res.status(201).json({
      ride,
      pickupCoordinates,
      captainInRadius
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


module.exports.getFare = async(req , res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// module.exports.confirmRide = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { rideId } = req.body;

//   try {
//     // Confirm the ride and update captain
//     const ride = await rideService.confirmRide({ rideId, captain: req.captain });

//     // Populate captain and user for frontend
//     const populatedRide = await rideModel.findOne({ _id: ride._id })
//       .populate('user')
//       .populate('captain');

//     // Extra debug logging
//     console.log('---[DEBUG] confirmRide---');
//     console.log('Ride ID:', rideId);
//     console.log('User socketId:', populatedRide.user?.socketId);
//     console.log('Captain:', JSON.stringify(populatedRide.captain));
//     console.log('Populated Ride:', JSON.stringify(populatedRide));

//     // Emit to user with full info
//     if (populatedRide.user && populatedRide.user.socketId) {
//       sendMessageToSocketId(populatedRide.user.socketId, {
//         event: 'ride-accepted',
//         data: populatedRide
//       });
//       console.log('ride-accepted event emitted to user socket:', populatedRide.user.socketId);
//     } else {
//       console.warn('No socketId found for user, cannot emit ride-accepted');
//     }

//     return res.status(200).json(populatedRide);
//   } catch (err) {
//     console.log('[ERROR] confirmRide:', err);
//     return res.status(500).json({ message: err.message });
//   }
// }

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    // Ride confirm
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    // Populate data for frontend
    const populatedRide = await rideModel.findById(ride._id)
      .populate('user')
      .populate('captain');

    // Emit to user when captain accepts
    if (populatedRide.user && populatedRide.user.socketId) {
      sendMessageToSocketId(populatedRide.user.socketId, {
        event: 'ride-accepted',
        data: populatedRide,
      });
      console.log('✅ ride-accepted event sent to user:', populatedRide.user.socketId);
    }

    return res.status(200).json(populatedRide);
  } catch (err) {
    console.error('confirmRide error:', err);
    return res.status(500).json({ message: err.message });
  }
};
