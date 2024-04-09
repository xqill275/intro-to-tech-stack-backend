// Import required modules
const express = require('express');
const jobController = require('../controllers/jobs');

// Create router instance
const router = express.Router();

// Apply body-parsing middleware
router.use(express.json());

// Define routes
router.post('/createJob', jobController.createJob);

router.get('/getJobs', jobController.getJobs);

// Export router
module.exports = router;

