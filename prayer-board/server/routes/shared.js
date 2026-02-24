const express = require('express');
const router = express.Router();
const {
    getSharedRequest,
    prayShared,
    unprayShared,
    commentShared
} = require('../controllers/requestController');

// All routes are public — anyone with the link can access
router.get('/:token', getSharedRequest);
router.post('/:token/pray', prayShared);
router.post('/:token/unpray', unprayShared);
router.post('/:token/comments', commentShared);

module.exports = router;
