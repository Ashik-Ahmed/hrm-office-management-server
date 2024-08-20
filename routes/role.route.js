const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { createNewRole, getAllRole, editRoleById } = require('../controllers/role.controller');

const router = express.Router();


router.route('/')
    .post(verifyToken, createNewRole)
    .get(verifyToken, getAllRole)


router.route('/:id')
    .patch(verifyToken, editRoleById)

module.exports = router