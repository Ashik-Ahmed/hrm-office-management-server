const express = require('express');
const { Pool } = require('pg');
const postgresContrller = require('../controllers/postgres.controller')

const router = express.Router()

// const pool = new Pool({
//     user: 'postgres',
//     host: '192.168.10.192',
//     database: 'a2p',
//     password: 'postgres',
//     port: 5432,
// });

router.route('/')
    .get(postgresContrller.getPostgresData)

// app.get('/get-postgres-data', (req, res) => {
//     const dbdata = pool.query("SELECT date, cli, client_id, operator,message_type, sum(count) Dipping_Count FROM public.dipping_summary where date='2023-07-19' group by date, cli, client_id, operator, message_type order by 6 desc", (error, results) => {
//         if (error) {
//             throw error;
//         }
//         res.json(results.rows);
//     });
//     console.log(dbdata);
// })

module.exports = router;