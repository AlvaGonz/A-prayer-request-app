# Data Model Design (MongoDB / Mongoose)

## User Schema

```javascript
// server/models/User.js
const userSchema = new mongoose.Schema({
  displayName:    { type: String, required: true, trim: true, maxlength: 50 },
  email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash:   { type: String, required: true },              // bcrypt hash
  role:           { type: String, enum: ['member', 'admin'], default: 'member' },
  // Push notification subscription (stored as JSON object)
  pushSubscription: { type: mongoose.Schema.Types.Mixed, default: null },
  // Soft-delete / audit
  isActive:       { type: Boolean, default: true },
}, {
  timestamps: true   // createdAt, updatedAt auto-managed
});
// Index for login lookup
userSchema.index({ email: 1 });
```

| Field | Type | Notes |
| :--- | :--- | :--- |
| **displayName** | String | Shown when posting non-anonymously |
| **email** | String | Unique, used for login |
| **passwordHash** | String | bcrypt-hashed password |
| **role** | String enum | `member` or `admin` |
| **pushSubscription** | Mixed | Web Push subscription JSON |
| **isActive** | Boolean | Soft-delete flag |

## PrayerRequest Schema

```javascript
// server/models/PrayerRequest.js
const prayerRequestSchema = new mongoose.Schema({
  body:           { type: String, required: true, trim: true, maxlength: 1000 },
  isAnonymous:    { type: Boolean, default: false },
  // Author — null for guest posts
  author:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  // Denormalized display name (snapshot at post time, or "Anonymous")
  authorName:     { type: String, default: 'Anonymous' },
  // Prayer count (denormalized for fast reads)
  prayedCount:    { type: Number, default: 0, min: 0 },
  // Lifecycle
  status:         { type: String, enum: ['open', 'answered', 'archived', 'hidden'], default: 'open' },
  // Audit
  isDeleted:      { type: Boolean, default: false },          // soft delete
  deletedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  deletedAt:      { type: Date, default: null },
}, {
  timestamps: true
});
// Indexes for the wall query (newest first, only active & open)
prayerRequestSchema.index({ isDeleted: 1, status: 1, createdAt: -1 });
```

| Field | Type | Notes |
| :--- | :--- | :--- |
| **body** | String | The prayer request text (max 1000 chars) |
| **isAnonymous** | Boolean | If true, author identity is hidden on the wall |
| **author** | ObjectId / null | Ref to User; null = guest post |
| **authorName** | String | Snapshot: display name or "Anonymous" |
| **prayedCount** | Number | Denormalized count for fast rendering |
| **status** | String enum | `open`, `answered`, `archived`, `hidden` |
| **isDeleted** | Boolean | Soft delete flag |

## PrayerInteraction Schema

```javascript
// server/models/PrayerInteraction.js
const prayerInteractionSchema = new mongoose.Schema({
  request:        { type: mongoose.Schema.Types.ObjectId, ref: 'PrayerRequest', required: true },
  // Who prayed — null for guests
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  // Fingerprint for basic guest dedup (optional, e.g. hashed IP or session ID)
  guestIdentifier: { type: String, default: null },
}, {
  timestamps: true   // createdAt = when the prayer happened
});
// Compound index to prevent duplicate prayers from the same user on the same request
prayerInteractionSchema.index({ request: 1, user: 1 }, { unique: true, sparse: true });
// Index for looking up all prayers for a specific request
prayerInteractionSchema.index({ request: 1, createdAt: -1 });
```

| Field | Type | Notes |
| :--- | :--- | :--- |
| **request** | ObjectId | Which prayer request was prayed for |
| **user** | ObjectId / null | Which registered user prayed (null = guest) |
| **guestIdentifier** | String / null | Optional hash for guest dedup |

## Relationships Diagram

*   **USER** (one) creates many **PRAYER_REQUEST**s (via `author`)
*   **USER** (one) creates many **PRAYER_INTERACTION**s (via `user`)
*   **PRAYER_REQUEST** (one) receives many **PRAYER_INTERACTION**s (via `request`)
