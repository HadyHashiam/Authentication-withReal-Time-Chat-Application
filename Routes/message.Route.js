const express = require('express');
const { createMessage, getMessages } = require('../Controllers/message.Controller');
const authService = require('../Controllers/auth.Controller');

const router = express.Router();

router.use(authService.protect);

router.post('/', createMessage);
router.get('/:chatId', getMessages);

module.exports = router;
