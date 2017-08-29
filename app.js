const express = require('express');
const bodyParser = require('body-parser');
const database = require('./services/databaseHelper');

const indexRouter = require('./routes/index.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use('/', indexRouter);
app.listen(3000);