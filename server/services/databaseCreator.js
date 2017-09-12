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
    name varchar(40) NOT NULL)")
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
    photoUrl varchar(255))")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
db.none("CREATE TABLE IF NOT EXISTS administrator(id SERIAL PRIMARY KEY, \
    username varchar(40) NOT NULL, \
    password varchar(40) NOT NULL)")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
db.none("CREATE TABLE IF NOT EXISTS foodprice(schoolID integer references school(id), \
    foodID integer references food(id), \
    price integer not null)")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
db.none("CREATE TABLE IF NOT EXISTS favoritefood(employeeID integer references employee(id), \
    foodID1 integer references food(id), \
    foodID2 integer references food(id), \
    foodID3 integer references food(id), \
    foodID4 integer references food(id), \
    foodID5 integer references food(id))")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});

module.exports = {
    db
};