const pgp = require('pg-promise')({
    query: e => {
        console.log('QUERY:', e.query);
    }
});

const conn = process.env.DATABASE_URL ?
    {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
    :
    {
        connectionString: 'postgres://usermathakur:admin@localhost:5432/mathakur'
    };

console.log("Using: " + conn.connectionString);
const db = pgp(conn);


db.none("CREATE TABLE IF NOT EXISTS company(id uuid DEFAULT gen_random_uuid() PRIMARY KEY, \
        name varchar(40) UNIQUE NOT NULL, \
        password varchar(155) NOT NULL, \
        rand varchar(10) NOT NULL, \
        allowfundsbelowzero boolean DEFAULT false, \
        frozen boolean DEFAULT false)")
    .then(() => {
        db.none("CREATE TABLE IF NOT EXISTS employee(id uuid DEFAULT gen_random_uuid() PRIMARY KEY, \
                name varchar(40) NOT NULL, \
                nickname varchar(20), \
                credit integer NOT NULL, \
                photoUrl varchar(255) DEFAULT \'tzeqj4l6kjyq0jptankn\', \
                companyid uuid REFERENCES company(id), \
                active boolean DEFAULT TRUE)")
            .then(() => {
                db.none("CREATE TABLE IF NOT EXISTS shoppinghistory(employeeId uuid REFERENCES employee(id), \
                    day DATE NOT NULL DEFAULT CURRENT_DATE, \
                    productIds uuid[], \
                    productNames text[], \
                    productPrices integer[] NOT NULL,\
                    creditBefore integer NOT NULL, \
                    PRIMARY KEY(employeeId, day) \
                    )")
                db.none("CREATE TABLE IF NOT EXISTS adminhistory(employeeId uuid REFERENCES employee(id), \
                    day DATE NOT NULL DEFAULT CURRENT_DATE, \
                    adminName varchar(40), \
                    action varchar(40), \
                    creditBefore integer NOT NULL, \
                    creditAfter integer NOT NULL \
                    )")
            })
            .catch(error => {
                console.log('ERROR:', error);
            });
        db.none("CREATE TABLE IF NOT EXISTS administrator(id uuid DEFAULT gen_random_uuid() PRIMARY KEY, \
                name varchar(40) NOT NULL, \
                username varchar(40) NOT NULL, \
                password varchar(40) NOT NULL, \
                rand varchar(10) NOT NULL, \
                companyid uuid REFERENCES company(id), \
                UNIQUE (companyid, username))")
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
                price integer not null, \
                active boolean DEFAULT TRUE)")
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