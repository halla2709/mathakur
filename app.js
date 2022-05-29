const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const database = require('./server/services/databaseCreator').db;
const dbHelper = require('./server/services/databaseHelper');

const companyRouter = require('./server/routes/companyRouter');
const employeeRouter = require('./server/routes/employeeRouter');
const productRouter = require('./server/routes/productRouter');
const loginRouter = require('./server/routes/loginRouter');
const adminRouter = require('./server/routes/adminRouter');

app.use(bodyParser.json({ type: 'application/json', limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/company', companyRouter);
app.use('/employee', employeeRouter);
app.use('/product', productRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use(express.static('./app'));
app.listen(Number(process.env.PORT || 3000));