
// routes/ride.routes.js
const express = require('express');
const router = express.Router();
const { body , query } = require('express-validator');
const rideController = require('../controllers/ride.controller'); // spelling fix: "controllers"
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/status',
  authMiddleware.authUser,
  query('rideId').isMongoId().withMessage('Invalid ride ID'),
  rideController.getRideStatus
);


router.post(
  '/create',
  authMiddleware.authUser,
  body('pickup')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Invalid pickup address'),

  body('destination')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Invalid destination address'),

  body('vehicleType')
    .isString()
    .isIn(['auto', 'car', 'motorcycle'])
    .withMessage('Invalid vehicle type'),

  rideController.createRide // yahi main controller call hoga
);


router.get('/get-fare',
  authMiddleware.authUser,
  query('pickup')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Invalid pickup address'),
  query('destination')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Invalid destination address'),
  rideController.getFare 
)

router.post('/confirm',
  authMiddleware.authCaptain,
  body('rideId')
    .isMongoId().withMessage('Invalid ride ID'),
    rideController.confirmRide
)

module.exports = router;

