const express = require('express');
const router = express.Router();
const {
    getSharedRequest,
    prayShared,
    commentShared
} = require('../controllers/requestController');

// All routes are public — anyone with the link can access
router.get('/:token', getSharedRequest);
router.post('/:token/pray', prayShared);
router.post('/:token/comments', commentShared);

module.exports = router;
