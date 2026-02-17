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

// Protected routes
router.post('/requests/:id/comments', protect, createComment);
router.delete('/comments/:id', protect, deleteComment);

module.exports = router;
