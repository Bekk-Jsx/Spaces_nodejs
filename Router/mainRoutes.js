const express = require('express');
const mainController = require('../controllers/mainController');
const mainAuthController = require('../controllers/mainAuthController');

const router = express.Router();


router.get('/', mainController.getDatabases);
router.post('/add_database', mainAuthController.isMainAdmin, mainController.addDatabase);


module.exports = router;