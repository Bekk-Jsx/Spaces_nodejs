const express = require('express');
const inviteController = require('../../Controllers/Tenant/inviteController');
const mainAuthController = require('../../Controllers/mainAuthController');

const router = express.Router();


router.get('/', mainAuthController.isMainAdmin, inviteController.getAll);
router.post('/', mainAuthController.isMainAdmin, inviteController.addInvite);
// router.post('/add_database', mainController.addDatabase);


module.exports = router;