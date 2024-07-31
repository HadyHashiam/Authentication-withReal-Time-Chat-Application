const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const ApiError = require('../utils/apiError');

exports.sendFriendRequest = asyncHandler(async (req, res, next) => {
  const { recipientId } = req.body;
  const senderId = req.user._id;

  const recipient = await User.findById(recipientId);
  const sender = await User.findById(senderId);

  if (!recipient) {
    return next(new ApiError('Recipient not found', 404));
  }

  // Initialize friendRequests if undefined
  if (!recipient.friendRequests) {
    recipient.friendRequests = [];
  }

  // Initialize sentRequests if undefined
  if (!sender.sentRequests) {
    sender.sentRequests = [];
  }

  // Check if already sent
  if (recipient.friendRequests.some(request => request.id === String(senderId))) {
    return next(new ApiError('Friend request already sent', 400));
  }

  // Add to recipient's friendRequests
  recipient.friendRequests.push({ name: sender.name, id: senderId });
  await recipient.save();

  // Add to sender's sentRequests
  sender.sentRequests.push({ name: recipient.name, id: recipientId });
  await sender.save();

  res.status(200).json({ message: 'Friend request sent successfully' });
});

exports.acceptFriendRequest = asyncHandler(async (req, res, next) => {
  const { senderId } = req.body;
  const recipientId = req.user._id;

  const sender = await User.findById(senderId);
  const recipient = await User.findById(recipientId);

  if (!sender) {
    return next(new ApiError('Sender not found', 404));
  }

  // Initialize friendRequests if undefined
  if (!recipient.friendRequests) {
    recipient.friendRequests = [];
  }

  // Initialize friends if undefined
  if (!recipient.friends) {
    recipient.friends = [];
  }

  // Initialize friends if undefined
  if (!sender.friends) {
    sender.friends = [];
  }

  // Remove from recipient's friendRequests
  recipient.friendRequests = recipient.friendRequests.filter(request => request.id !== String(senderId));

  // Add to recipient's friends
  recipient.friends.push({ name: sender.name, id: senderId, image: sender.profileImg });
  await recipient.save();

  // Add to sender's friends
  sender.friends.push({ name: recipient.name, id: recipientId, image: recipient.profileImg });

  // Remove from sender's sentRequests
  sender.sentRequests = sender.sentRequests.filter(request => request.id !== String(recipientId));
  await sender.save();

  res.status(200).json({ message: 'Friend request accepted successfully' });
});

exports.getSentRequests = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('sentRequests');
  res.status(200).json({ sentRequests: user.sentRequests });
});

exports.getFriendRequests = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('friendRequests');
  res.status(200).json({ friendRequests: user.friendRequests });
});
