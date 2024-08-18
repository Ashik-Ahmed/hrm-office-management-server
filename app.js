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
const leaveRoute = require('./routes/leave.route')
const conveyanceRoute = require('./routes/conveyance.route')
const requisitionRoute = require('./routes/Requisition.route')
const departmentRoute = require('./routes/department.route')
const visitorRoute = require('./routes/visitor.route')
const taskRoute = require('./routes/task.route')
const roleRoute = require('./routes/role.route')
const postgresRoute = require('./routes/postgres.route')


app.use('/api/v1/employee', employeeRoute)
app.use('/api/v1/leaveApplication', leaveApplicationRoute)
app.use('/api/v1/leave', leaveRoute)
app.use('/api/v1/conveyance', conveyanceRoute)
app.use('/api/v1/requisition', requisitionRoute)
app.use('/api/v1/department', departmentRoute)
app.use('/api/v1/visitor', visitorRoute)
app.use('/api/v1/task', taskRoute)
app.use('/api/v1/role', roleRoute)
app.use('/api/v1/postgres', postgresRoute)



module.exports = app;