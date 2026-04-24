const express = require('express');
const router = express.Router();

// Ensure these are destructured with { } to match your exports
const { getDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// Debugging logs - if the server still crashes, check your terminal to see which is undefined
console.log('Protect Check:', typeof protect); 
console.log('Controller Check:', typeof getDashboard);

router.get('/', protect, getDashboard);

module.exports = router;