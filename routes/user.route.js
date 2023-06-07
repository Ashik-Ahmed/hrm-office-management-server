const express = require('express')
const userController = require('../controllers/user.controller')

const router = express.Router();

router.post('/login', userController.login);

router.route('/')
    .post(userController.createUser)


module.exports = router;