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

function updateEmployeeCredit(db, employeeId, transaction) {
    let queryString = 'UPDATE employee SET credit = credit - $1 WHERE id = $2';
    return db.none(queryString, [transaction, employeeId]);
}

function updateEmployeeImage(db, employeeId, url) {
    let queryString = 'UPDATE employee SET photourl = $1 WHERE id = $2';
    return db.none(queryString, [url, employeeId]);
}

function updateEmployee(db, employeeId, newCredit, newName, newNickname, newPhotoUrl, newStatus) {
    let queryString = 'UPDATE employee SET credit = $1, name = $2, nickname = $3, active = $4 ';
    if (newPhotoUrl) {
        queryString += ', photourl = $5 WHERE id = $6';
        return db.none(queryString, [newCredit, newName, newNickname, newStatus, newPhotoUrl, employeeId])
    }
    else {
        queryString += 'WHERE id = $5';
        return db.none(queryString, [newCredit, newName, newNickname, newStatus, employeeId]);
    }
}

function updateProductPrice(db, companyId, productId, newPrice, newStatus) {
    let queryString = 'UPDATE productprice SET price = $1, active = $2 WHERE companyid = $3 and productid = $4';
    return db.none(queryString, [newPrice, newStatus, companyId, productId]);
}

function updateProduct(db, productId, newName, newPhotoUrl) {
    let queryString = 'UPDATE product SET name = $1 ';
    if (newPhotoUrl) {
        queryString += ", photourl = $2 WHERE id = $3";
        return db.none(queryString, [newName, newPhotoUrl, productId]);
    }
    else {
        queryString += " WHERE id = $2";
        return db.none(queryString, [newName, productId]);
    }
}

function updateAllowFundsBelowZero(db, companyId, newValue) {
    let queryString = 'UPDATE company SET allowfundsbelowzero = $1 WHERE id = $2';
    return db.none(queryString, [newValue, companyId]);
}

function updateCompanyPassword(db, companyName, passwordHash, randomString) {
    let queryString = 'UPDATE company SET password = $1, rand = $2 WHERE name = $3';
    return db.none(queryString, [passwordHash, randomString, companyName]);
}

function deleteFromTable(db, tableName, condition) {
    let queryString = 'DELETE FROM ' + replaceTableName(tableName);
    if (condition) {
        queryString += ' WHERE ' + condition;
    };
    queryString += ";";
    return db.none(queryString);
}

function deleteCompany(db, companyId) {
    return deleteFromTable(db, 'administrator', 'companyid = \'' + companyId + '\'')
    .then(function() {
        return deleteFromTable(db, 'employee', 'companyid = \'' + companyId + '\'');
    })
    .then(function() {
        return deleteFromTable(db, 'productprice', 'companyid = \'' + companyId + '\'');
    })
    .then(function() {
        queryString = 'DELETE FROM product p WHERE NOT EXISTS (SELECT FROM productprice WHERE productid = p.id)';
        return db.none(queryString);
    })
    .then(function() {
        return deleteFromTable(db, 'company', 'id = \'' + companyId + '\'');
    })
    .then(function() {
        console.log("Successfully deleted company " + companyId);
    })
    .catch(function(error) {
        console.error(error);
        throw error;
    });
}

function toggleCompanyFreeze(db, companyId)
{
    let queryString = 'UPDATE company SET frozen = NOT frozen WHERE id = $1';
    return db.none(queryString, [companyId]);
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
    deleteFromTable,
    updateEmployeeImage,
    updateProduct,
    updateEmployee,
    updateProductPrice,
    updateAllowFundsBelowZero,
    deleteCompany,
    updateCompanyPassword,
    updateEmployeeCredit,
    toggleCompanyFreeze
}