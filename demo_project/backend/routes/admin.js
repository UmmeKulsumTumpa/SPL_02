const express = require('express');
const router = express.Router();
const adminRepo = require('../repositories/admin_repo');

router.get('/', adminRepo.getAllAdmins);

router.post('/add', adminRepo.addNewAdmin);

router.delete('/remove/:username', adminRepo.removeAdmin);

router.put('/update/password/:username', adminRepo.updateAdminPassword);

router.put('/update/email/:username', adminRepo.updateAdminEmail);

router.put('/update/pinCode/:username', adminRepo.updateAdminPinCode);

router.get('/:username', adminRepo.getAdminByUsername);

router.get('/checkUserExist/:username', adminRepo.checkUserExists);

module.exports = router;
