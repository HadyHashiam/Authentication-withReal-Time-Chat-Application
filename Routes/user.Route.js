const express = require('express');
const { getUserValidator, createUserValidator, updateUserValidator, deleteUserValidator, changeUserPasswordValidator, updateLoggedUserValidator, } = require('../utils/validators/userValidator');
const { getUsers, getUser, createUser, updateUser, deleteUser, uploadUserImage, resizeImage, changeUserPassword, getLoggedUserData, updateLoggedUserPassword, updateLoggedUserData, deleteLoggedUserData, } = require('../Controllers/user.Controller');

const authService = require('../Controllers/auth.Controller');

const router = express.Router();

router.use(authService.protect);


router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);

router.route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router.route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.put('/changePassword/:id', changeUserPasswordValidator, changeUserPassword);

// Admin
router.use(authService.allowedTo('admin'));

module.exports = router;
