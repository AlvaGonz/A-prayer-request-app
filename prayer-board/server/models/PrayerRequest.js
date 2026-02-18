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

// Fix: Ensure the shareToken index is properly sparse.
// A non-sparse unique index on shareToken causes duplicate key errors
// when multiple documents have no shareToken value.
(async () => {
  try {
    const collection = PrayerRequest.collection;

    // Drop ALL existing shareToken indexes to start fresh
    const indexes = await collection.indexes();
    for (const idx of indexes) {
      if (idx.key && idx.key.shareToken !== undefined && idx.name !== '_id_') {
        console.log(`Dropping shareToken index: ${idx.name} (sparse: ${idx.sparse})`);
        await collection.dropIndex(idx.name);
      }
    }

    // Remove shareToken field entirely from docs that don't have a real value
    const result = await collection.updateMany(
      { $or: [{ shareToken: null }, { shareToken: '' }] },
      { $unset: { shareToken: '' } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Cleaned shareToken from ${result.modifiedCount} documents`);
    }

    // Recreate as sparse unique index
    await collection.createIndex(
      { shareToken: 1 },
      { unique: true, sparse: true }
    );
    console.log('shareToken sparse unique index ensured.');
  } catch (err) {
    // Collection might not exist yet — that's fine on first run
    if (err.code !== 26) {
      console.warn('shareToken index fix warning:', err.message);
    }
  }
})();

module.exports = PrayerRequest;

