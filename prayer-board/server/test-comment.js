const mongoose = require('mongoose');
const Comment = require('./models/Comment');
const PrayerRequest = require('./models/PrayerRequest');

mongoose.connect('mongodb+srv://adrianaalvarezgonz_db_user:2PDebg7E9I5VboQz@prayerboardcluster.ncgjylc.mongodb.net/?appName=PrayerBoardCluster')
    .then(async () => {
        console.log('Connected');
        try {
            const commentData = {
                prayerRequest: '699de7e3a2762f6e63185b45',
                body: 'Test',
                authorName: 'Anónimo',
                guestId: 'my-guest-id'
            };

            const comment = await Comment.create(commentData);
            console.log('Created comment', comment);

            const commentCount = await Comment.countDocuments({
                prayerRequest: '699de7e3a2762f6e63185b45',
                isDeleted: false
            });
            await PrayerRequest.findByIdAndUpdate('699de7e3a2762f6e63185b45', { commentCount });
            console.log('Updated prayer request count to', commentCount);

        } catch (e) {
            console.error('Error:', e);
        }
        process.exit(0);
    });
