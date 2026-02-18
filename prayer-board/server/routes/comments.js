const express = require('express');
const router = express.Router();
const {
  getComments,
  createComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/requests/:id/comments', getComments);
router.post('/requests/:id/comments', createComment); // Allow anonymous comments

// Protected routes - only delete requires authentication
router.delete('/comments/:id', protect, deleteComment);

module.exports = router;
