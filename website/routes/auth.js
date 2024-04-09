// Import required modules
const express = require('express');
const authController = require('../controllers/auth');

// Create router instance
const router = express.Router();

// Apply body-parsing middleware
router.use(express.json());

// Define routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Export router
module.exports = router;
