const mongoose = require('mongoose');

const prayerRequestSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  authorName: {
    type: String,
    default: 'Anonymous'
  },
  prayedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  commentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['open', 'answered', 'archived', 'hidden'],
    default: 'open'
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

// Indexes for the wall query
prayerRequestSchema.index({ isDeleted: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('PrayerRequest', prayerRequestSchema);
