// Import required modules
const express = require('express');
const profileController = require('../controllers/profile');

// Create router instance
const router = express.Router();

// Apply body-parsing middleware
router.use(express.json());


// Define routes
router.post('/updateProfile', profileController.updateProfile);
router.get('/getProfileData', profileController.getProfileData);
// Export router
module.exports = router;