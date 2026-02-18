const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  prayerRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrayerRequest',
    required: true,
    index: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null  // Allow null for anonymous comments
  },
  authorName: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 500
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for fast lookup by prayer request
commentSchema.index({ prayerRequest: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
