const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');

module.exports.createRide = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

try {
  const ride = await rideService.createRide({
    userId: req.user._id, // authMiddleware se aaya user
    pickup,
    destination,
    vehicleType,
  });

  return res.status(201).json(ride);
} catch (err) {
  return res.status(500).json({ message: err.message });
}

};

