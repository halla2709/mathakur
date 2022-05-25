const pgp = require('pg-promise')({
    query: e => {
        console.log('QUERY:', e.query);
    }
});

const connString = process.env.DATABASE_URL || 'postgres://usermathakur:admin@localhost:5432/mathakur';
console.log("Using:" + connString);
const db = pgp({
    connectionString: connString
    // ssl: {
    //   rejectUnauthorized: false
    // }
  });


db.none("CREATE TABLE IF NOT EXISTS school(id uuid DEFAULT gen_random_uuid() PRIMARY KEY, \
    name varchar(40) UNIQUE NOT NULL, \
    password varchar(155) NOT NULL, \
    rand varchar(10) NOT NULL, \
    allowFundsBelowZero boolean)")
.catch(error => {
    console.log('ERROR:', error);
});
db.none("CREATE TABLE IF NOT EXISTS food(id uuid DEFAULT gen_random_uuid() PRIMARY KEY, \
    name varchar(40) NOT NULL, \
    category varchar(40), \
    photoUrl varchar(255) DEFAULT \'bazcykvn86tp963v8ocn\')")
.catch(error => {
    console.log('ERROR:', error);
});
db.none("CREATE TABLE IF NOT EXISTS employee(id uuid DEFAULT gen_random_uuid() PRIMARY KEY, \
    name varchar(40) NOT NULL, \
    nickname varchar(20), \
    credit integer NOT NULL, \
    photoUrl varchar(255) DEFAULT \'tzeqj4l6kjyq0jptankn\', \
    schoolid uuid REFERENCES school(id))")
.catch(error => {
    console.log('ERROR:', error);
});
db.none("CREATE TABLE IF NOT EXISTS administrator(id uuid DEFAULT gen_random_uuid() PRIMARY KEY, \
    name varchar(40) NOT NULL, \
    username varchar(40) UNIQUE NOT NULL, \
    password varchar(40) NOT NULL, \
    rand varchar(10) NOT NULL, \
    schoolid uuid REFERENCES school(id))")
.catch(error => {
    console.log('ERROR:', error);
});
db.none("CREATE TABLE IF NOT EXISTS foodprice(schoolid uuid REFERENCES school(id), \
    foodID integer REFERENCES food(id), \
    price integer not null)")
.catch(error => {
    console.log('ERROR:', error);
});

module.exports = {
    db
};