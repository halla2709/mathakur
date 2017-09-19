function getFromTable(db, tableName, conditions) {
    let queryString = 'SELECT * FROM ' + replaceTableName(tableName);
    if (conditions.length > 0) queryString += ' WHERE';
    conditions.forEach(function (condition) {
        queryString += " " + condition;
    });
    queryString += ";";
    console.log(queryString);
    return db.any(queryString, tableName);
}

function insertIntoTable(db, tableName, columns, values) {
    let queryString = 'INSERT INTO ' + replaceTableName(tableName);
    let columnsString = '(';
    let valuesString = '(';
    if (columns.length != values.length) throw "Column and value number mismatch";
    for(let i = 0; i < columns.length-1; i++) {
        columnsString += columns[i] + ', ';
        valuesString += '$' + (i+1) + ', ';
    }
    columnsString += ' ' + columns[columns.length-1] + ')';
    valuesString += ' $' + values.length + ')';
    queryString += columnsString + " VALUES" + valuesString + ';';
    console.log(queryString);
    return db.none(queryString, values);
}

function updateCreditOfEmployee(db, employeeId, newCredit) {
    let queryString = 'UPDATE employee SET credit = $1 WHERE id = $2';
    return db.none(queryString, [newCredit, employeeId]);
}

function deleteFromTable(db, tableName, conditions) {
    let queryString = 'DELETE FROM ' + replaceTableName(tableName);
    if (conditions.length > 0) queryString += ' WHERE';
    conditions.forEach(function (condition) {
        queryString += " " + condition;
    });
    queryString += ";";
    console.log(queryString);
    return db.any(queryString, tableName);
}

function replaceTableName(tableName) {
    switch (tableName) {
        case "administator":
            return 'administrator';
            break;
        case "employee":
            return 'employee';
            break;
        case "recentfood":
            return 'recentfood';
            break;
        case "food":
            return 'food';
            break;
        case "foodprice":
            return 'foodprice';
            break;
        case "school":
            return 'school';
            break;    
        default:
            console.error("no such table " + tableName);
            break;
    }
}

module.exports = {
    getFromTable,
    insertIntoTable,
    updateCreditOfEmployee,
    deleteFromTable
}