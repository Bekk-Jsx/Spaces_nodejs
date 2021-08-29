const express = require('express');
const mainAuthController = require('../controllers/mainAuthController');
const mainUsersController = require('../controllers/mainUsersController');

const router = express.Router();


router.get('/', mainUsersController.getAllMainUsers);
router.post('/signup', mainAuthController.signUp);
router.post('/login', mainAuthController.login);


module.exports = router;