const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const database = require('./server/services/databaseCreator').db;
const dbHelper = require('./server/services/databaseHelper');

const schoolRouter = require('./server/routes/schoolRouter');
const employeeRouter = require('./server/routes/employeeRouter');

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/school', schoolRouter);
app.use('/employee', employeeRouter);
app.use(express.static('./app'));
app.listen(3000);