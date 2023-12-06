const express = require('express');
const postgresContrller = require('../controllers/postgres.controller')

const router = express.Router()


router.route('/')
    .get(postgresContrller.getPostgresData)



module.exports = router;