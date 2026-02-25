const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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
      guestId: c.guestId,
      isEdited: c.isEdited,
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
    let { body, authorName, isAnonymous, guestId } = req.body;

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

    // Optional Auth Support
    let user = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).select('-password');
      } catch (err) { }
    }

    const isUserAuthenticated = !!user;
    const commentAuthorName = isUserAuthenticated
      ? user.displayName
      : (authorName && authorName.trim() ? authorName.trim() : 'Anonymous');

    // Create comment
    const commentData = {
      prayerRequest: req.params.id,
      body,
      authorName: commentAuthorName,
      guestId: guestId || null
    };

    // Add author ID only if authenticated
    if (isUserAuthenticated) {
      commentData.author = user._id;
    }

    const comment = await Comment.create(commentData);

    // Update comment count
    const commentCount = await Comment.countDocuments({
      prayerRequest: req.params.id,
      isDeleted: false
    });
    await PrayerRequest.findByIdAndUpdate(req.params.id, { commentCount });

    res.status(201).json({
      comment: {
        id: comment._id,
        body: comment.body,
        authorName: comment.authorName,
        authorId: comment.author ? comment.author.toString() : null,
        guestId: comment.guestId,
        isEdited: comment.isEdited,
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
    const commentCount = await Comment.countDocuments({
      prayerRequest: comment.prayerRequest,
      isDeleted: false
    });
    await PrayerRequest.findByIdAndUpdate(comment.prayerRequest, { commentCount });

    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error('Delete comment error:', error.message);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Public (conditionally Private)
const updateComment = async (req, res) => {
  try {
    let { body, guestId } = req.body;
    body = sanitizeInput(body);

    if (!body || body.length < 1 || body.length > 500) {
      return res.status(400).json({ error: 'Comment must be between 1 and 500 characters' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.isDeleted) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    let isAuthorized = false;
    let user = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
      } catch (err) { }
    }

    if (user && (user.role === 'admin' || (comment.author && comment.author.toString() === user._id.toString()))) {
      isAuthorized = true;
    } else if (!user && comment.guestId && comment.guestId === guestId) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Not authorized to edit this comment' });
    }

    comment.body = body;
    comment.isEdited = true;
    await comment.save();

    res.json({
      comment: {
        id: comment._id,
        body: comment.body,
        authorName: comment.authorName,
        authorId: comment.author ? comment.author.toString() : null,
        guestId: comment.guestId,
        isEdited: comment.isEdited,
        createdAt: comment.createdAt
      }
    });

  } catch (error) {
    console.error('Update comment error:', error.message);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment
};
