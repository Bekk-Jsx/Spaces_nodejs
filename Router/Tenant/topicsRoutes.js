const express = require('express');
const topicsController = require('../../Controllers/Tenant/topicsController');
const mainAuthController = require('../../Controllers/mainAuthController');

const router = express.Router();


router.get('/', mainAuthController.isMainAdmin, topicsController.getAll);
router.post('/', mainAuthController.isMainAdmin, topicsController.addOne);
// router.post('/add_database', mainController.addDatabase);


module.exports = router;