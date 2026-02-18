const sanitizeHtml = require('sanitize-html');
const Comment = require('../models/Comment');
const PrayerRequest = require('../models/PrayerRequest');

// Sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return sanitizeHtml(input.trim(), {
    allowedTags: [],
    allowedAttributes: {}
  });
};

// @desc    Get comments for a prayer request
// @route   GET /api/requests/:id/comments
// @access  Public
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      prayerRequest: req.params.id,
      isDeleted: false
    })
    .sort({ createdAt: 1 })
    .lean();

    const formattedComments = comments.map(c => ({
      id: c._id,
      body: c.body,
      authorName: c.authorName,
      authorId: c.author ? c.author.toString() : null,
      createdAt: c.createdAt
    }));

    res.json({
      comments: formattedComments,
      count: formattedComments.length
    });
  } catch (error) {
    console.error('Get comments error:', error.message);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// @desc    Create comment
// @route   POST /api/requests/:id/comments
// @access  Public (supports both authenticated and anonymous)
const createComment = async (req, res) => {
  try {
    let { body, authorName, isAnonymous } = req.body;

    // Sanitize input
    body = sanitizeInput(body);
    authorName = sanitizeInput(authorName);

    // Validation
    if (!body || body.length < 1 || body.length > 500) {
      return res.status(400).json({ 
        error: 'Comment must be between 1 and 500 characters' 
      });
    }

    // Check if prayer request exists
    const prayerRequest = await PrayerRequest.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!prayerRequest) {
      return res.status(404).json({ error: 'Prayer request not found' });
    }

    // Determine author info
    const isUserAuthenticated = !!req.user;
    const commentAuthorName = isUserAuthenticated 
      ? req.user.displayName 
      : (authorName && authorName.trim() ? authorName.trim() : 'Anonymous');
    
    // Create comment
    const commentData = {
      prayerRequest: req.params.id,
      body,
      authorName: commentAuthorName
    };

    // Add author ID only if authenticated
    if (isUserAuthenticated) {
      commentData.author = req.user._id;
    }

    const comment = await Comment.create(commentData);

    // Update comment count
    prayerRequest.commentCount = await Comment.countDocuments({
      prayerRequest: req.params.id,
      isDeleted: false
    });
    await prayerRequest.save();

    res.status(201).json({
      comment: {
        id: comment._id,
        body: comment.body,
        authorName: comment.authorName,
        authorId: comment.author ? comment.author.toString() : null,
        createdAt: comment.createdAt
      },
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Create comment error:', error.message);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// @desc    Delete comment (soft delete)
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check permissions
    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    // Soft delete
    comment.isDeleted = true;
    comment.deletedBy = req.user._id;
    comment.deletedAt = new Date();
    await comment.save();

    // Update comment count on prayer request
    const prayerRequest = await PrayerRequest.findById(comment.prayerRequest);
    if (prayerRequest) {
      prayerRequest.commentCount = await Comment.countDocuments({
        prayerRequest: comment.prayerRequest,
        isDeleted: false
      });
      await prayerRequest.save();
    }

    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error('Delete comment error:', error.message);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment
};
