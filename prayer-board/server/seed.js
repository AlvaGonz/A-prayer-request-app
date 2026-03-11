require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Assuming the models are defined in the models folder
const User = require('./models/User');
const PrayerRequest = require('./models/PrayerRequest');
const Comment = require('./models/Comment');

const connectDB = require('./config/db');

const seedDB = async () => {
  try {
    // 1. Connect to MONGODB_URI
    await connectDB();
    console.log('MongoDB Connected for Seeding...');

    // 2. Drop existing data
    await User.deleteMany({});
    await PrayerRequest.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data.');

    // Create test user (Mongoose pre-save hook will hash 'devpass123')
    const testUser = await User.create({
      displayName: 'Dev User',
      email: 'dev@test.com',
      password: 'devpass123',
      role: 'member'
    });
    console.log('Test user created: dev@test.com / devpass123');

    // Create 3 prayer requests
    const pr1 = await PrayerRequest.create({
      author: testUser._id,
      authorName: testUser.displayName,
      title: 'Praying for my family',
      body: 'Please pray for my family during this difficult season of transition. We need wisdom and guidance.',
      status: 'open',
      prayCount: 2
    });

    const pr2 = await PrayerRequest.create({
      author: testUser._id,
      authorName: testUser.displayName,
      title: 'Health concerns',
      body: 'Waiting on test results from the doctor tomorrow. Feeling anxious but trusting God.',
      status: 'open',
      prayCount: 5
    });

    const pr3 = await PrayerRequest.create({
      author: testUser._id,
      authorName: testUser.displayName,
      title: 'Job interview',
      body: 'I have a final round interview this Thursday. Praying for peace and clarity.',
      status: 'answered',
      testimony: 'Praise God, I received the job offer! Thank you everyone for praying.',
      prayCount: 12
    });
    console.log('3 Prayer requests created (1 answered).');

    // Create 2 comments on the first prayer request
    await Comment.create({
        prayerRequest: pr1._id,
        author: testUser._id,
        authorName: testUser.displayName,
        body: 'Standing with you in prayer!'
    });

    await Comment.create({
        prayerRequest: pr1._id,
        authorName: 'Anonymous', // Used for unauthenticated local test simulations
        body: 'God is faithful. He will see you through.'
    });
    console.log('2 Comments added to first request.');

    // 4. Disconnect and exit
    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedDB();
