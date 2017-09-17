const pgp = require('pg-promise')({
    query: e => {
        console.log('QUERY:', e.query);
    }
});

const cn = {
    host: 'localhost', // 'localhost' is the default;
    port: 5432, // 5432 is the default;
    database: 'mathakur',
    user: 'mathakur',
    password: 'mathakur'
};
const db = pgp(cn);

db.none("CREATE TABLE IF NOT EXISTS school(id SERIAL PRIMARY KEY, \
    name varchar(40) UNIQUE NOT NULL, \
    password varchar(155) NOT NULL)")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
db.none("CREATE TABLE IF NOT EXISTS food(id SERIAL PRIMARY KEY, \
    name varchar(40) NOT NULL, \
    category varchar(40), \
    photoUrl varchar(255))")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
db.none("CREATE TABLE IF NOT EXISTS employee(id SERIAL PRIMARY KEY, \
    name varchar(40) NOT NULL, \
    nickname varchar(20), \
    credit integer NOT NULL, \
    photoUrl varchar(255), \
    schoolID integer REFERENCES school(id))")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
db.none("CREATE TABLE IF NOT EXISTS administrator(id SERIAL PRIMARY KEY, \
    name varchar(40) NOT NULL, \
    username varchar(40) NOT NULL, \
    password varchar(40) NOT NULL, \
    schoolID integer REFERENCES school(id))")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
db.none("CREATE TABLE IF NOT EXISTS foodprice(schoolID integer REFERENCES school(id), \
    foodID integer REFERENCES food(id), \
    price integer not null)")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
db.none("CREATE TABLE IF NOT EXISTS recentfood(employeeID integer REFERENCES employee(id), \
    foodID1 integer REFERENCES food(id), \
    foodID2 integer REFERENCES food(id), \
    foodID3 integer REFERENCES food(id), \
    foodID4 integer REFERENCES food(id), \
    foodID5 integer REFERENCES food(id))")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});

module.exports = {
    db
};