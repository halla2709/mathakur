const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
//const database = require('./services/databaseCreator').db;
//const dbHelper = require('./services/databaseHelper');

const indexRouter = require('./routes/index.js');

/*dbHelper.insertIntoTable(database, 'employee', ['name', 'nickname', 'credit'], ['halla', 'halla', 500])
    .then(function() {
        console.log("inserted into employee");
    })
    .catch(function(error) {
        console.error(error);
    });

dbHelper.getFromTable(database, 'employee', ['name = \'halla\''])
    .then(function(data) {
        console.log(data);
    })
    .catch(function(error) {
        console.error(error)
    });*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', indexRouter);
app.use(express.static('app'));
app.listen(3000);