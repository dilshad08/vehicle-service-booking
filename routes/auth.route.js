const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');

router.post('/signin', AuthController.userSignIn)

router.post('/signup', AuthController.userSignUp)

module.exports = router