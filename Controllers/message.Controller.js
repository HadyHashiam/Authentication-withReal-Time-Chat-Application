const asyncHandler = require('express-async-handler');
const Message = require('../Models/messageModel');
const Chat = require('../Models/chatModel');
const ApiError = require('../utils/apiError');

// Save a new message
exports.createMessage = asyncHandler(async (req, res, next) => {
  const { chatId, content } = req.body;
  const sender = req.user._id;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ApiError('Chat not found', 404));
  }

  const message = await Message.create({ chat: chatId, content, sender });

  // Emit the message to the chat room
  req.io.to(chatId).emit('message', message);

  res.status(201).json({ data: message });
});

// Get messages for a chat
exports.getMessages = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chat: chatId }).populate('sender', 'name');

  if (!messages) {
    return next(new ApiError('No messages found', 404));
  }

  res.status(200).json({ data: messages });
});
