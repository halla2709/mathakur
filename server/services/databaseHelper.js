function getFromTable(db, tableName, condition) {
    let queryString = 'SELECT * FROM ' + replaceTableName(tableName);
    if (condition) {
        queryString += ' WHERE ' + condition;
    }
    queryString += ";";
    return db.any(queryString, tableName);
}

function insertIntoTableReturningID(db, tableName, columns, values) {
    if(tableName == 'productprice') {
        console.error(tableName + " does not have id");
        return;
    }
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
    queryString += columnsString + " VALUES" + valuesString + ' RETURNING id;';
    return db.one(queryString, values);
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

function updateProductPrice(db, companyId, productId, newPrice) {
    let queryString = 'UPDATE productprice SET price = $1 WHERE companyid = $2 and productid = $3';
    return db.none(queryString, [newPrice, companyId, productId]);
}

function updateProductImage(db, productId, url) {
    let queryString = 'UPDATE product SET photourl = $1 WHERE id = $2';
    return db.none(queryString, [url, productId]);
}

function updateAllowFundsBelowZero(db, companyId, newValue) {
    let queryString = 'UPDATE company SET allowFundsBelowZero = $1 WHERE id = $2';
    return db.none(queryString, [newValue, companyId]);
}

function deleteFromTable(db, tableName, condition) {
    let queryString = 'DELETE FROM ' + replaceTableName(tableName);
    if (condition) {
        queryString += ' WHERE ' + condition;
    };
    queryString += ";";
    return db.any(queryString, tableName);
}

function replaceTableName(tableName) {
    switch (tableName) {
        case "administrator":
            return 'administrator';
        case "employee":
            return 'employee';
        case "product":
            return 'product';
        case "productprice":
            return 'productprice';
        case "company":
            return 'company';
        default:
            console.error("no such table " + tableName);
            break;
    }
}

module.exports = {
    getFromTable,
    insertIntoTable,
    insertIntoTableReturningID,
    updateCreditOfEmployee,
    deleteFromTable,
    updateEmployeeImage,
    updateProductImage,
    updateEmployee,
    updateProductPrice,
    updateAllowFundsBelowZero
}