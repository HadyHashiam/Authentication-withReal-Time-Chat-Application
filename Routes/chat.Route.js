const express = require('express');
const { getOrCreateChat, getChatMessages, createMessage } = require('../Controllers/chat.Controller');
const authService = require('../Controllers/auth.Controller');

const router = express.Router();

router.use(authService.protect);

router.post('/', getOrCreateChat);
router.get('/:chatId/messages', getChatMessages);
router.post('/:chatId/messages', createMessage);

module.exports = router;
