const pgp = require('pg-promise')({
    query: e => {
        console.log('QUERY:', e.query);
    }
});

const connString = process.env.DATABASE_URL || 'postgres://mathakur:mathakur@localhost:5432/mathakur';
const db = pgp({
    connectionString: connString,
    ssl: {
      rejectUnauthorized: false
    }
  });


db.none("CREATE TABLE IF NOT EXISTS school(id SERIAL PRIMARY KEY, \
    name varchar(40) UNIQUE NOT NULL, \
    password varchar(155) NOT NULL, \
    rand varchar(10) NOT NULL)")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
db.none("CREATE TABLE IF NOT EXISTS food(id SERIAL PRIMARY KEY, \
    name varchar(40) NOT NULL, \
    category varchar(40), \
    photoUrl varchar(255) DEFAULT \'bazcykvn86tp963v8ocn\')")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
db.none("CREATE TABLE IF NOT EXISTS employee(id SERIAL PRIMARY KEY, \
    name varchar(40) NOT NULL, \
    nickname varchar(20), \
    credit integer NOT NULL, \
    photoUrl varchar(255) DEFAULT \'tzeqj4l6kjyq0jptankn\', \
    schoolName varchar(40) REFERENCES school(name))")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
db.none("CREATE TABLE IF NOT EXISTS administrator(id SERIAL PRIMARY KEY, \
    name varchar(40) NOT NULL, \
    username varchar(40) UNIQUE NOT NULL, \
    password varchar(40) NOT NULL, \
    rand varchar(10) NOT NULL, \
    schoolName varchar(40) REFERENCES school(name))")
.catch(error => {
    console.log('ERROR:', error); // print the error;
});
db.none("CREATE TABLE IF NOT EXISTS foodprice(schoolName varchar(40) REFERENCES school(name), \
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