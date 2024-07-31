const asyncHandler = require('express-async-handler');
const Chat = require('../Models/chatModel');
const Message = require('../Models/messageModel');
const ApiError = require('../utils/apiError');

// Create or get chat between friends
exports.getOrCreateChat = asyncHandler(async (req, res, next) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length < 2) {
    return next(new ApiError('userIds must be an array of at least two user IDs', 400));
  }

  let chat = await Chat.findOne({ users: { $all: userIds, $size: userIds.length } });

  if (!chat) {
    chat = await Chat.create({ users: userIds });
  }

  res.status(200).json({ data: chat });
});

// Get messages for a chat
exports.getChatMessages = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chat: chatId }).populate('sender', 'name');

  res.status(200).json({ data: messages });
});

// Save a new message
exports.createMessage = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;
  const { content } = req.body;
  const sender = req.user._id; 

  const message = await Message.create({ chat: chatId, content, sender });

  req.io.to(chatId).emit('message', message);

  res.status(201).json({ data: message });
});
