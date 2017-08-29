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

module.exports = {
    db
};