const express = require('express');
const router = express.Router();
const path = require('path');
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');
const savePhotoToCloudinary = require("../services/cloudinaryHelper").savePhotoToCloudinary;
const frozenCheck = require('../services/isFrozenCheck');

router.get('/', function (req, res, next) {
    dbHelper.getFromTable(database, 'employee')
        .then(function (data) {
            req.employees = data;
            res.json(req.employees);
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not get employees'] });
        });
});

router.get('/all/:companyId', frozenCheck.verifyActiveCompany, function (req, res, next) {
    let activeFilter = '';
    if(req.query.active) {
        activeFilter = 'AND active = true';
    }

    dbHelper.getFromTable(database, 'employee', 'companyid = \'' + req.params.companyId + '\' ' + activeFilter )
    .then(function (data) {
        req.employees = data;
        res.json(req.employees);
    })
    .catch(function (error) {
        console.error(error)
        res.statusCode = 500;
        return res.json({ errors: ['Could not get employees for company ' + req.params.companyId] });
    });
});

router.get('/:employeeId', function (req, res, next) {
    dbHelper.getFromTable(database, 'employee', 'id = \'' + req.params.employeeId + '\'')
        .then(function (data) {
            req.employee = data;
            if (req.employee.length > 0) {
                res.json(req.employee[0]);
            }
            else {
                res.statusCode = 500;
                return res.json({ errors: ['No employee found with id ' + req.params.employeeId] });
            }
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not get employees for company ' + req.params.employeeId] });
        });
});

router.patch('/:id', createAdminHistoryEntry, savePhotoToCloudinary, function (req, res, next) {
    const id = req.params.id;
    const newCredit = req.body.newCredit;
    let newPhotoUrl = res.photoUrl;
    const newName = req.body.newName;
    const newNickame = req.body.newNickname;
    const newStatus = req.body.newStatus;

    if (!(typeof req.body.photo !== 'undefined' && req.body.photo !== '')) {
        newPhotoUrl = undefined;
    }
      dbHelper.updateEmployee(database, id, newCredit, newName, newNickame, newPhotoUrl, newStatus)
        .then(function () {
            res.statusCode = 200;
            res.json({ photoUrl: newPhotoUrl });
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not update employee'] });
        });
    
});

router.patch('/updatecredit/:id', frozenCheck.findCompanyIdFromBody, frozenCheck.verifyActiveCompany, function (req, res, next) {
    const id = req.params.id;
    const transaction = req.body.transaction;

    dbHelper.updateEmployeeCredit(database, id, transaction)
        .then(function () {
            res.statusCode = 200;
            res.end();
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not update employee'] });
        });
});

router.patch('/transaction/:id', createShoppingHistoryEntry, updateCredit, function (req, res, next) {
    res.statusCode = 200;
    res.end();
});

function createAdminHistoryEntry(req, res, next){
    // const id = req.params.id;
    // const newCredit = req.body.newCredit;
    // let newPhotoUrl = res.photoUrl;
    // const newName = req.body.newName;
    // const newNickame = req.body.newNickname;
    // const newStatus = req.body.newStatus;
    // const transaction = req.body.transaction;
    let action;
    let creditAfter;
    if (req.body.newCredit !== undefined) {
        action = "update";
        creditAfter = req.body.newCredit;

        dbHelper.getFromTable(database, 'employee', 'id = \'' + req.params.id + '\'')
        .then(function(employee) {
            creditBefore = employee[0].credit;
            if(creditBefore !== creditAfter) {
                dbHelper.addAdminHistoryForEmployee(database, req.params.id, req.body.adminName, action, creditBefore, creditAfter)
                .catch(function (error) {
                    console.error(error);
                    res.statusCode = 500;
                    return res.json({ errors: ['Could not save admin history'] });
                });
            }
            next();
        })
        .catch(function (error) {
            console.error(error);
            res.statusCode = 500;
            return res.json({ errors: ['Could not get employee credit before'] });
        });
    }
    else {
        action = "create";
        creditAfter = req.body.credit;
        dbHelper.addAdminHistoryForEmployee(database, req.params.id, req.body.adminName, action, 0, creditAfter)
        .catch(function (error) {
            console.error(error);
            res.statusCode = 500;
            return res.json({ errors: ['Could not save admin history'] });
        });
        next();
    }
}

function createShoppingHistoryEntry(req, res, next) {

    //Transaction á að vera array af [
    //     {
    //         name: "epli",
    //         price: 50,
    //         id: "abc",
    //         quantity: 3,
    //         orderTotal: 150
    //     }
    // ]
    let productIds = [];
    let productNames = [];
    let productPrices = [];
    let creditBefore; // get from db
    req.body.receipt.forEach(product => {
        for (let i = 0; i < product.quantity; i++) {
            productIds.push(product.id);
            productNames.push(product.name);
            productPrices.push(product.price);  
        }        
    });

    
    dbHelper.getFromTable(database, 'employee', 'id = \'' + req.params.id + '\'')
    .then(function(employee) {
        creditBefore = employee[0].credit;
        dbHelper.addShoppingHistoryForEmployee(database, req.params.id, productIds, productNames, productPrices, creditBefore)
        .catch(function (error) {
            console.error(error);
            res.statusCode = 500;
            return res.json({ errors: ['Could not save employee history'] });
        });
    })
    .catch(function (error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ errors: ['Could not get employee credit before'] });
    });

    next();
}

function updateCredit(req, res, next) {
    let totalCost = 0;
    
    req.body.receipt.forEach(product => {
        totalCost += product.quantity*product.price;
    });
    dbHelper.updateEmployeeCredit(database, req.params.id, totalCost)
        .then(function () {
            next();
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not update credit'] });
        });

}


router.post('/', savePhotoToCloudinary, addNicknameIfNotExists, insertEmployee, createAdminHistoryEntry, function (req, res, next) {
    res.statusCode = 200;
    res.json({ photoUrl: res.photoUrl });
});

function insertEmployee(req, res, next) {
    dbHelper.insertIntoTable(database, 'employee',
        ['name', 'nickname', 'credit', 'photoUrl', 'companyid', 'active'], [req.body.name, req.body.nickname, req.body.credit, res.photoUrl, req.body.companyId, req.body.active], true)
        .then(function (createdEmployee) {
            console.log(createdEmployee);
            req.params.id = createdEmployee.id;
            next();
        })
        .catch(function (error) {
            console.error(error);
            res.statusCode = 500;
            return res.json({ errors: ['Could not create employee'] });
        });
}

router.delete('/:id', function (req, res, next) {
    dbHelper.deleteFromTable(database, 'employee', 'id = \'' + req.params.id + '\'')
        .then(function () {
            res.statusCode = 200;
            res.end();
        })
        .catch(function (error) {
            console.error(error);
            res.statusCode = 500;
            return res.json({ errors: ['Could not delete employee'] });
        })
});

function addNicknameIfNotExists(req, res, next) {
    if (typeof req.body.nickname === 'undefined') {
        req.body.nickname = req.body.name.split(" ")[0];
    }
    next();
}

router.get('/history/:employeeId', getHistoryForEmployee, function (req, res, next) {
    res.json(res.history);
});

function getHistoryForEmployee(req, res, next) {
    dbHelper.getAllHistoryForEmployee(database, req.params.employeeId)
        .then(function (data) {
            res.history = data;
            next();
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not get employee history'] });
        });
}

module.exports = router;