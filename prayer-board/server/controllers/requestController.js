const sanitizeHtml = require('sanitize-html');
const crypto = require('crypto');
const PrayerRequest = require('../models/PrayerRequest');
const Comment = require('../models/Comment');

// Sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return sanitizeHtml(input.trim(), {
    allowedTags: [],
    allowedAttributes: {}
  });
};

// @desc    Get all prayer requests
// @route   GET /api/requests
// @access  Public
const getRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || 'open';

    const query = {
      isDeleted: false
    };

    if (status !== 'all') {
      query.status = status;
    }

    const total = await PrayerRequest.countDocuments(query);

    const requests = await PrayerRequest.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const formattedRequests = requests.map(req => ({
      id: req._id,
      body: req.body,
      authorName: req.authorName,
      isAnonymous: req.isAnonymous,
      prayedCount: req.prayedCount,
      commentCount: req.commentCount || 0,
      status: req.status,
      createdAt: req.createdAt,
      author: req.author ? req.author.toString() : null
    }));

    res.json({
      requests: formattedRequests,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      }
    });
  } catch (error) {
    console.error('Get requests error:', error.message);
    res.status(500).json({ error: 'Failed to fetch prayer requests' });
  }
};

// @desc    Create prayer request
// @route   POST /api/requests
// @access  Public (guests allowed)
const createRequest = async (req, res) => {
  try {
    let { body, isAnonymous = true } = req.body;

    // Sanitize input
    body = sanitizeInput(body);

    // Validation
    if (!body || body.length < 10 || body.length > 1000) {
      return res.status(400).json({
        error: 'Request body must be between 10 and 1000 characters'
      });
    }

    const request = await PrayerRequest.create({
      body,
      isAnonymous: req.user ? isAnonymous : true,
      author: req.user ? req.user._id : null,
      authorName: req.user && !isAnonymous ? req.user.displayName : 'Anonymous'
    });

    res.status(201).json({
      request: {
        id: request._id,
        body: request.body,
        authorName: request.authorName,
        isAnonymous: request.isAnonymous,
        prayedCount: request.prayedCount,
        commentCount: request.commentCount || 0,
        status: request.status,
        createdAt: request.createdAt,
        author: request.author ? request.author.toString() : null
      }
    });
  } catch (error) {
    console.error('Create request error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error keyPattern:', JSON.stringify(error.keyPattern));
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to create prayer request' });
  }
};

// @desc    Increment prayer count
// @route   POST /api/requests/:id/pray
// @access  Public
const pray = async (req, res) => {
  try {
    const request = await PrayerRequest.findById(req.params.id);

    if (!request || request.isDeleted) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Increment count safely
    const currentCount = typeof request.prayedCount === 'number' ? request.prayedCount : 0;
    request.prayedCount = currentCount + 1;

    await request.save();

    res.json({
      prayedCount: request.prayedCount,
      message: 'Your prayer has been noted. Thank you for lifting this up.'
    });
  } catch (error) {
    console.error('Pray error:', error);
    res.status(500).json({ error: 'Failed to record prayer', details: error.message });
  }
};

// @desc    Update request status
// @route   PATCH /api/requests/:id/status
// @access  Private
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await PrayerRequest.findById(req.params.id);

    if (!request || request.isDeleted) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const isAuthor = request.author && request.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Validate transitions
    if (status === 'answered' && !isAuthor) {
      return res.status(403).json({ error: 'Only the author can mark as answered' });
    }

    if (['hidden', 'archived'].includes(status) && !isAdmin) {
      return res.status(403).json({ error: 'Only admins can hide or archive' });
    }

    request.status = status;
    await request.save();

    res.json({
      request: {
        id: request._id,
        status: request.status
      }
    });
  } catch (error) {
    console.error('Update status error:', error.message);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// @desc    Soft delete request
// @route   DELETE /api/requests/:id
// @access  Private (Admin only)
const deleteRequest = async (req, res) => {
  try {
    const request = await PrayerRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Soft delete
    request.isDeleted = true;
    request.deletedBy = req.user._id;
    request.deletedAt = new Date();
    await request.save();

    res.json({ message: 'Request removed' });
  } catch (error) {
    console.error('Delete request error:', error.message);
    res.status(500).json({ error: 'Failed to delete request' });
  }
};

// @desc    Generate a shareable link for a prayer request
// @route   POST /api/requests/:id/share
// @access  Private (author or admin)
const generateShareLink = async (req, res) => {
  try {
    const request = await PrayerRequest.findById(req.params.id);

    if (!request || request.isDeleted) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const isAuthor = request.author && request.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to share this request' });
    }

    if (!request.shareToken) {
      request.shareToken = crypto.randomBytes(16).toString('hex');
      await request.save();
    }

    res.json({
      shareToken: request.shareToken,
      shareUrl: `/shared/${request.shareToken}`
    });
  } catch (error) {
    console.error('Generate share link error:', error.message);
    res.status(500).json({ error: 'Failed to generate share link' });
  }
};

// @desc    Get a shared prayer request by token
// @route   GET /api/shared/:token
// @access  Public
const getSharedRequest = async (req, res) => {
  try {
    const request = await PrayerRequest.findOne({
      shareToken: req.params.token,
      isDeleted: false
    }).lean();

    if (!request) {
      return res.status(404).json({ error: 'Shared prayer request not found' });
    }

    const comments = await Comment.find({ request: request._id })
      .sort({ createdAt: 1 })
      .lean();

    const formattedComments = comments.map(c => ({
      id: c._id,
      body: c.body,
      authorName: c.authorName,
      createdAt: c.createdAt
    }));

    res.json({
      request: {
        id: request._id,
        body: request.body,
        authorName: request.authorName,
        isAnonymous: request.isAnonymous,
        prayedCount: request.prayedCount,
        commentCount: request.commentCount || 0,
        status: request.status,
        createdAt: request.createdAt
      },
      comments: formattedComments
    });
  } catch (error) {
    console.error('Get shared request error:', error.message);
    res.status(500).json({ error: 'Failed to fetch shared prayer request' });
  }
};

// @desc    Pray for a shared request by token
// @route   POST /api/shared/:token/pray
// @access  Public
const prayShared = async (req, res) => {
  try {
    const request = await PrayerRequest.findOne({
      shareToken: req.params.token,
      isDeleted: false
    });

    if (!request) {
      return res.status(404).json({ error: 'Shared prayer request not found' });
    }

    request.prayedCount += 1;
    await request.save();

    res.json({
      prayedCount: request.prayedCount,
      message: 'Your prayer has been noted. Thank you for lifting this up.'
    });
  } catch (error) {
    console.error('Pray shared error:', error.message);
    res.status(500).json({ error: 'Failed to record prayer' });
  }
};

// @desc    Add a guest comment to a shared request
// @route   POST /api/shared/:token/comments
// @access  Public
const commentShared = async (req, res) => {
  try {
    let { body, guestName } = req.body;

    body = sanitizeInput(body);
    guestName = sanitizeInput(guestName || 'A Friend');

    if (!body || body.length < 1 || body.length > 500) {
      return res.status(400).json({ error: 'Comment must be between 1 and 500 characters' });
    }

    if (guestName.length > 50) {
      guestName = guestName.substring(0, 50);
    }

    const request = await PrayerRequest.findOne({
      shareToken: req.params.token,
      isDeleted: false
    });

    if (!request) {
      return res.status(404).json({ error: 'Shared prayer request not found' });
    }

    const comment = await Comment.create({
      body,
      authorName: guestName,
      author: null,
      request: request._id
    });

    request.commentCount = (request.commentCount || 0) + 1;
    await request.save();

    res.status(201).json({
      comment: {
        id: comment._id,
        body: comment.body,
        authorName: comment.authorName,
        createdAt: comment.createdAt
      }
    });
  } catch (error) {
    console.error('Comment shared error:', error.message);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

module.exports = {
  getRequests,
  createRequest,
  pray,
  updateStatus,
  deleteRequest,
  generateShareLink,
  getSharedRequest,
  prayShared,
  commentShared
};
