const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');


//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Server is Running!!')
})

const employeeRoute = require('./routes/employee.route')
const leaveApplicationRoute = require('./routes/leaveApplication.route')


app.use('/api/v1/employee', employeeRoute)
app.use('/api/v1/leaveApplication/', leaveApplicationRoute)


module.exports = app;