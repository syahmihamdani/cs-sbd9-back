const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/', userController.updateUser);
router.get('/:email', userController.getUserByEmail);
router.delete('/:id', userController.deleteUser);
router.post('/topUp', userController.topUpUser);

module.exports = router;