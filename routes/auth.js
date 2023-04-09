const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// const verifyToken = require('../middlewares/verifyToken');

router.post('/register', authController.signup);
router.post('/login', authController.login);
router.post('/forgot', authController.forgotPassword);
router.get('/profile', authController.getProfile);

module.exports = router;
