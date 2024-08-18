const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { createNewRole, getAllRole } = require('../controllers/role.controller');

const router = express.Router();


router.route('/')
    .post(verifyToken, createNewRole)
    .get(verifyToken, getAllRole)

module.exports = router