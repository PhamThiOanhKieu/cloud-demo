const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// login
router.get('/login', authController.loginPage);
router.post('/login', authController.login);

// register
router.get('/register', authController.registerPage);
router.post('/register', authController.register);

// logout
router.get('/logout', authController.logout);

module.exports = router;
