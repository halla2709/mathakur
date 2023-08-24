const express = require('express');
const router = express.Router();
const path = require('path');
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');
const savePhotoToCloudinary = require("../services/cloudinaryHelper").savePhotoToCloudinary;

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

router.get('/all/:companyId', function (req, res, next) {
    dbHelper.getFromTable(database, 'employee', 'companyid = \'' + req.params.companyId + '\'')
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

router.patch('/:id', savePhotoToCloudinary, function (req, res, next) {
    const id = req.params.id;
    const newCredit = req.body.newCredit;
    let newPhotoUrl = res.photoUrl;
    const newName = req.body.newName;
    const newNickame = req.body.newNickname;

    if (!(typeof req.body.photo !== 'undefined' && req.body.photo !== '')) {
        newPhotoUrl = undefined;
    }

    dbHelper.updateEmployee(database, id, newCredit, newName, newNickame, newPhotoUrl)
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

router.patch('/updatecredit/:id', function (req, res, next) {
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

router.post('/', savePhotoToCloudinary, addNicknameIfNotExists, function (req, res, next) {
    if (typeof req.body.credit === 'undefined') {
        req.body.credit = 0;
    }

    dbHelper.insertIntoTable(database, 'employee',
        ['name', 'nickname', 'credit', 'photoUrl', 'companyid'], [req.body.name, req.body.nickname, req.body.credit, res.photoUrl, req.body.companyId])
        .then(function () {
            res.statusCode = 200;
            res.json({ photoUrl: res.photoUrl });
        })
        .catch(function (error) {
            console.error(error);
            res.statusCode = 500;
            return res.json({ errors: ['Could not create employee'] });
        });
});

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

module.exports = router;