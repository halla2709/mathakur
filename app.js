const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const database = require('./services/databaseHelper').db;

const indexRouter = require('./routes/index.js');

database.none("CREATE TABLE IF NOT EXISTS skoli(id SERIAL PRIMARY KEY, nafn varchar(40) NOT NULL)")
.then(data => {
    console.log('DATA:', data); // print data;
})
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
database.none("CREATE TABLE IF NOT EXISTS matur(id SERIAL PRIMARY KEY, nafn varchar(40) NOT NULL, flokkur varchar(40))")
.then(data => {
    console.log('DATA:', data); // print data;
})
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
database.none("CREATE TABLE IF NOT EXISTS notandi(id SERIAL PRIMARY KEY, nafn varchar(40) NOT NULL, galunafn varchar(20), inneign integer NOT NULL)")
.then(data => {
    console.log('DATA:', data); // print data;
})
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
database.none("CREATE TABLE IF NOT EXISTS stjornendur(id SERIAL PRIMARY KEY, notandanafn varchar(40) NOT NULL, password varchar(40) NOT NULL)")
.then(data => {
    console.log('DATA:', data); // print data;
})
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
database.none("CREATE TABLE IF NOT EXISTS skolimatur(skolaID integer, matarID integer, verd integer not null)")
.then(data => {
    console.log('DATA:', data); // print data;
})
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
database.none("CREATE TABLE IF NOT EXISTS uppahaldsmatur(notandaID integer, matarID1 integer, matarID2 integer, matarID3 integer, matarID4 integer, matarID5 integer)")
.then(data => {
    console.log('DATA:', data); // print data;
})
.catch(error => {
    console.log('ERROR:', error); // print the error;
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', indexRouter);
app.listen(3000);