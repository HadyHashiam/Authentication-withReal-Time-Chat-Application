const express = require('express');
const { sendFriendRequest, acceptFriendRequest, getSentRequests, getFriendRequests } = require('../Controllers/friendRequest.Controller');
const authService = require('../Controllers/auth.Controller');

const router = express.Router();

router.use(authService.protect);

router.post('/send', sendFriendRequest);
router.post('/accept', acceptFriendRequest);
router.get('/sent', getSentRequests);
router.get('/received', getFriendRequests);

module.exports = router;
