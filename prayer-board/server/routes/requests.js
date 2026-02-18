const express = require('express');
const router = express.Router();
const {
  getRequests,
  createRequest,
  pray,
  updateStatus,
  deleteRequest,
  generateShareLink
} = require('../controllers/requestController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getRequests);
router.post('/', createRequest); // Guests allowed
router.post('/:id/pray', pray);

// Protected routes
router.post('/:id/share', protect, generateShareLink);
router.patch('/:id/status', protect, updateStatus);
router.delete('/:id', protect, adminOnly, deleteRequest);

module.exports = router;
