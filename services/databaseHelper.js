const pgp = require('pg-promise')();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:brynjav@localhost:5432/testDB';
const db = pgp(connectionString);

function createTable(tableName, columns) {
    columns.unshift(tableName);
    const columnInjectionString = "";
    /*for(const i = ) {

    }*/
    const queryString = "CREATE TABLE IF NOT EXISTS $1(" + columnInjectionString + ")";
    db.none('CREATE TABLE IF NOT EXISTS $1')
}

module.exports = db;