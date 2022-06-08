const pgp = require('pg-promise')({
    query: e => {
        console.log('QUERY:', e.query);
    }
});

const connString = process.env.DATABASE_URL || 'postgres://usermathakur:admin@localhost:5432/mathakur';
console.log("Using:" + connString);
const db = pgp({
    connectionString: connString,
    ssl: {
      rejectUnauthorized: false
    }
});


db.none("CREATE TABLE IF NOT EXISTS company(id uuid DEFAULT gen_random_uuid() PRIMARY KEY, \
        name varchar(40) UNIQUE NOT NULL, \
        password varchar(155) NOT NULL, \
        rand varchar(10) NOT NULL, \
        allowFundsBelowZero boolean)")
    .then(() => {
        db.none("CREATE TABLE IF NOT EXISTS employee(id uuid DEFAULT gen_random_uuid() PRIMARY KEY, \
                name varchar(40) NOT NULL, \
                nickname varchar(20), \
                credit integer NOT NULL, \
                photoUrl varchar(255) DEFAULT \'tzeqj4l6kjyq0jptankn\', \
                companyid uuid REFERENCES company(id))")
            .catch(error => {
                console.log('ERROR:', error);
            });
        db.none("CREATE TABLE IF NOT EXISTS administrator(id uuid DEFAULT gen_random_uuid() PRIMARY KEY, \
                name varchar(40) NOT NULL, \
                username varchar(40) UNIQUE NOT NULL, \
                password varchar(40) NOT NULL, \
                rand varchar(10) NOT NULL, \
                companyid uuid REFERENCES company(id))")
            .catch(error => {
                console.log('ERROR:', error);
            });
    })
    .catch(error => {
        console.log('ERROR:', error);
    });
db.none("CREATE TABLE IF NOT EXISTS product(id uuid DEFAULT gen_random_uuid() PRIMARY KEY, \
        name varchar(40) NOT NULL, \
        category varchar(40), \
        photoUrl varchar(255) DEFAULT \'bazcykvn86tp963v8ocn\')")
    .then(() => {

        db.none("CREATE TABLE IF NOT EXISTS productprice(companyid uuid REFERENCES company(id), \
                productid uuid REFERENCES product(id), \
                price integer not null)")
            .catch(error => {
                console.log('ERROR:', error);
            });
    })
    .catch(error => {
        console.log('ERROR:', error);
    });

module.exports = {
    db
};