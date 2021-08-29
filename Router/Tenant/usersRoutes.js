const express = require('express');
const authController = require('../../Controllers/Tenant/authController');
// const usersController = require('../../Controllers/Tenant/usersController ');

const router = express.Router();


// router.get('/', mainUsersController.getAllMainUsers);
router.post('/signup', authController.signUp);
// router.post('/login', mainAuthController.login);


module.exports = router;