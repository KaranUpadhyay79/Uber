
const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({ fullname, email, password, vehicle }) => {
 
  if (
    !fullname?.firstname ||
    !fullname?.lastname ||
    !email ||
    !password ||
    !vehicle?.color ||
    !vehicle?.plate ||
    !vehicle?.capacity ||
    !vehicle?.vehicleType
  ) {
    throw new Error('All fields are required');
  }

 
  const existingCaptain = await captainModel.findOne({ email });
  if (existingCaptain) {
    throw new Error('Captain already exists');
  }

 
  const captain = await captainModel.create({
    fullname,
    email,
    password,
    vehicle
  });

  return captain;
};
