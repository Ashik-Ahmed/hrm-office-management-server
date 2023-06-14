const express = require('express')
const userController = require('../controllers/user.controller')

const router = express.Router();

router.post('/login', userController.login);

router.route('/')
    .post(userController.createUser)
    .get(userController.getAllUser)

router.route('/:id')
    .delete(userController.deleteUser)


module.exports = router;