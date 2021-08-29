const express = require('express');
const spacesController = require('../../Controllers/Tenant/spacesController');
const mainAuthController = require('../../Controllers/mainAuthController');

const router = express.Router();


router.get('/', mainAuthController.isMainAdmin, spacesController.getAll);
router.post('/', mainAuthController.isMainAdmin, spacesController.addOne);
// router.post('/add_database', mainController.addDatabase);


module.exports = router;