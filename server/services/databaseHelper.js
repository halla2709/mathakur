const getDb = require("./databaseCreator.js").getDb;

function getFromTable(tableName, condition) {
    let queryString = 'SELECT * FROM ' + replaceTableName(tableName);
    if (condition) {
        queryString += ' WHERE ' + condition;
    }
    queryString += ";";
    return getDb().any(queryString, tableName);
}

function insertIntoTableReturningID(tableName, columns, values) {
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
    return getDb().one(queryString, values);
}

function insertIntoTable(tableName, columns, values, returnId) {
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
    queryString += columnsString + " VALUES" + valuesString;
    if (returnId) {
        queryString += " RETURNING id";
        return getDb().one(queryString, values);
    }
    else {
        return getDb().none(queryString, values);
    }
}

function updateEmployeeCredit(employeeId, transaction) {
    let queryString = 'UPDATE employee SET credit = credit - $1 WHERE id = $2';
    return getDb().none(queryString, [transaction, employeeId]);
}

function updateEmployeeImage(employeeId, url) {
    let queryString = 'UPDATE employee SET photourl = $1 WHERE id = $2';
    return getDb().none(queryString, [url, employeeId]);
}

function updateEmployee(employeeId, newCredit, newName, newNickname, newPhotoUrl, newStatus) {
    let queryString = 'UPDATE employee SET credit = $1, name = $2, nickname = $3, active = $4 ';
    if (newPhotoUrl) {
        queryString += ', photourl = $5 WHERE id = $6';
        return getDb().none(queryString, [newCredit, newName, newNickname, newStatus, newPhotoUrl, employeeId])
    }
    else {
        queryString += 'WHERE id = $5';
        return getDb().none(queryString, [newCredit, newName, newNickname, newStatus, employeeId]);
    }
}

function addShoppingHistoryForEmployee (employeeId, productIds, productNames, productPrices, creditBefore) {
    let queryString = 'INSERT INTO shoppinghistory (employeeid, productIds, productNames, productPrices, creditBefore) VALUES ($1, $2::uuid[], $3, $4, $5) ';
    queryString += 'ON CONFLICT (employeeid, day) DO UPDATE SET ';
    queryString += 'productIds = array_cat(shoppinghistory.productIds, EXCLUDED.productIds), '
    queryString += 'productNames = array_cat(shoppinghistory.productNames, EXCLUDED.productNames), '
    queryString += 'productPrices = array_cat(shoppinghistory.productPrices, EXCLUDED.productPrices)'
    return getDb().none(queryString, [employeeId, productIds, productNames, productPrices, creditBefore]);
}

function addAdminHistoryForEmployee(employeeId, adminName, action, creditBefore, creditAfter) {
    let queryString = 'INSERT INTO adminhistory (employeeid, adminName, action, creditBefore, creditAfter) VALUES ($1, $2, $3, $4, $5) ';
    return getDb().none(queryString, [employeeId, adminName, action, creditBefore, creditAfter]);
}

function undoLastTransactionHistory(employeeId, transactionCount)
{
    let queryString = 'UPDATE shoppinghistory SET ';
    queryString += 'productprices = productprices[1:array_length(productprices,1)-$1], ';
    queryString += 'productnames = productnames[1:array_length(productnames,1)-$1], ';
    queryString += 'productids = productids[1:array_length(productids,1)-$1] ';
    queryString += 'WHERE employeeid = $2 AND day = CURRENT_DATE ';
    queryString += 'RETURNING productids;'
    return getDb().one(queryString, [transactionCount,employeeId])
    .then(function(data) {
        if (data.productids.length === 0) {
            return deleteFromTable('shoppinghistory', 'employeeid = \'' + employeeId + '\' AND day = CURRENT_DATE');
        }
    });
}

function updateProductPrice(companyId, productId, newPrice, newStatus) {
    let queryString = 'UPDATE productprice SET price = $1, active = $2 WHERE companyid = $3 and productid = $4';
    return getDb().none(queryString, [newPrice, newStatus, companyId, productId]);
}

function updateProduct(productId, newName, newPhotoUrl) {
    let queryString = 'UPDATE product SET name = $1 ';
    if (newPhotoUrl) {
        queryString += ", photourl = $2 WHERE id = $3";
        return getDb().none(queryString, [newName, newPhotoUrl, productId]);
    }
    else {
        queryString += " WHERE id = $2";
        return getDb().none(queryString, [newName, productId]);
    }
}

function updateAllowFundsBelowZero(companyId, newValue) {
    let queryString = 'UPDATE company SET allowfundsbelowzero = $1 WHERE id = $2';
    return getDb().none(queryString, [newValue, companyId]);
}

function updateCompanyPassword(companyName, passwordHash, randomString) {
    let queryString = 'UPDATE company SET password = $1, rand = $2 WHERE name = $3';
    return getDb().none(queryString, [passwordHash, randomString, companyName]);
}

function deleteFromTable(tableName, condition) {
    let queryString = 'DELETE FROM ' + replaceTableName(tableName);
    if (condition) {
        queryString += ' WHERE ' + condition;
    };
    queryString += ";";
    return getDb().none(queryString);
}

function deleteCompany(companyId) {
    return deleteFromTable('administrator', 'companyid = \'' + companyId + '\'')
    .then(function() {
        return deleteFromTable('employee', 'companyid = \'' + companyId + '\'');
    })
    .then(function() {
        return deleteFromTable('productprice', 'companyid = \'' + companyId + '\'');
    })
    .then(function() {
        queryString = 'DELETE FROM product p WHERE NOT EXISTS (SELECT FROM productprice WHERE productid = p.id)';
        return getDb().none(queryString);
    })
    .then(function() {
        return deleteFromTable('company', 'id = \'' + companyId + '\'');
    })
    .then(function() {
        console.log("Successfully deleted company " + companyId);
    })
    .catch(function(error) {
        console.error(error);
        throw error;
    });
}

function deleteEmployee(employeeId) {
    return deleteFromTable('adminhistory', 'employeeid = \'' + employeeId + '\'')
    .then(function() {
        return deleteFromTable('shoppinghistory', 'employeeid = \'' + employeeId + '\'');
    })
    .then(function() {
        return deleteFromTable('employee', 'id = \'' + employeeId + '\'');
    })
}

function toggleCompanyFreeze(companyId)
{
    let queryString = 'UPDATE company SET frozen = NOT frozen WHERE id = $1';
    return getDb().none(queryString, [companyId]);
}

function getAllHistoryForEmployee(employeeId) {
    let query = "SELECT day, creditbefore, null as productids, null as productprices, null as productnames, action, creditafter, adminname \
                    FROM adminhistory WHERE employeeid = cast($1 as UUID) \
                    UNION ALL \
                SELECT day, creditbefore, productids, productprices, productnames, null as action, null as creditafter, null as adminname  \
                    FROM shoppinghistory WHERE employeeid = cast($1 as UUID) \
                ORDER BY day DESC;"
    return getDb().any(query, [employeeId]);
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
        case "history":
            return 'history';
        case "adminhistory":
            return "adminhistory";
        case "shoppinghistory":
            return "shoppinghistory";
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
    toggleCompanyFreeze,
    addShoppingHistoryForEmployee,
    addAdminHistoryForEmployee,
    getAllHistoryForEmployee,
    undoLastTransactionHistory,
    deleteEmployee
}