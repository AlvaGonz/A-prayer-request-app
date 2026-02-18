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
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for the wall query
prayerRequestSchema.index({ isDeleted: 1, status: 1, createdAt: -1 });

const PrayerRequest = mongoose.model('PrayerRequest', prayerRequestSchema);

// Fix: Drop and recreate the shareToken index to ensure it is sparse.
// A non-sparse unique index on shareToken causes duplicate key errors
// when multiple documents have shareToken: null.
(async () => {
  try {
    const collection = PrayerRequest.collection;
    const indexes = await collection.indexes();
    const shareIdx = indexes.find(i => i.key && i.key.shareToken);
    if (shareIdx && !shareIdx.sparse) {
      console.log('Dropping non-sparse shareToken index and recreating as sparse...');
      await collection.dropIndex(shareIdx.name);
      await collection.createIndex({ shareToken: 1 }, { unique: true, sparse: true });
      console.log('shareToken index recreated as sparse.');
    }
    // Also clean up any existing null shareToken values to prevent issues
    await collection.updateMany(
      { shareToken: null },
      { $unset: { shareToken: '' } }
    );
  } catch (err) {
    // Index might not exist yet or collection not ready — that's fine
    if (err.code !== 26 && err.code !== 27) {
      console.warn('shareToken index fix warning:', err.message);
    }
  }
})();

module.exports = PrayerRequest;
