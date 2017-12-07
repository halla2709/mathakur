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

function updateEmployeeImage(db, employeeId, url) {
    let queryString = 'UPDATE employee SET photourl = $1 WHERE id = $2';
    return db.none(queryString, [url, employeeId]);
}

function updateEmployee(db, employeeId, newPhotoUrl, newCredit) {
    let queryString = 'UPDATE employee SET photourl = $1, credit = $2 WHERE id = $3';
    return db.none(queryString, [newPhotoUrl, newCredit, employeeId]);
}

function updateFoodPrice(db, schoolName, foodId, newPrice) {
    let queryString = 'UPDATE foodprice SET price = $1 WHERE schoolName = $2 and foodid = $3';
    return db.none(queryString, [newPrice, schoolName, foodId]);
}

function updateFoodImage(db, foodId, url) {
    let queryString = 'UPDATE food SET photourl = $1 WHERE id = $2';
    return db.none(queryString, [url, foodId]);
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
        case "administrator":
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
    deleteFromTable,
    updateEmployeeImage,
    updateFoodImage,
    updateEmployee,
    updateFoodPrice
}