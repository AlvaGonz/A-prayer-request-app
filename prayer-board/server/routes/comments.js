const express = require('express');
const router = express.Router();
const {
  getComments,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/requests/:id/comments', getComments);
router.post('/requests/:id/comments', createComment); // Allow anonymous comments

// Protected routes - only delete requires authentication
router.put('/comments/:id', updateComment); // Inside logic handles optional auth/guestId
router.delete('/comments/:id', protect, deleteComment);

module.exports = router;
