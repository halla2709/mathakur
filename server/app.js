const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const companyRouter = require('./routes/companyRouter');
const employeeRouter = require('./routes/employeeRouter');
const productRouter = require('./routes/productRouter');
const loginRouter = require('./routes/loginRouter');
const adminRouter = require('./routes/adminRouter');

app.use(bodyParser.json({ type: 'application/json', limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/company', companyRouter);
app.use('/employee', employeeRouter);
app.use('/product', productRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use(express.static('./app'));

module.exports = app;