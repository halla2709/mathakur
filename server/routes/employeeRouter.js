const express = require('express');
const router = express.Router();
const path = require('path');
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');
const savePhotoToCloudinary = require("../services/cloudinaryHelper").savePhotoToCloudinary;

router.get('/', function (req, res, next) {
    dbHelper.getFromTable(database, 'employee', [])
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

router.patch('/:id', savePhotoToCloudinary, function (req, res, next) {
    const id = req.params.id;
    const newCredit = req.body.newCredit;
    const newPhotoUrl = req.body.photoUrl;

    dbHelper.updateEmployee(database, id, newPhotoUrl, newCredit)
        .then(function() {
            res.statusCode = 200;
            res.json({photoUrl: newPhotoUrl});
        })
        .catch(function(error) {
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
        ['name', 'nickname', 'credit', 'photoUrl'], [req.body.name, req.body.nickname, req.body.credit, req.body.photoUrl])
        .then(function () {
            res.statusCode = 200;
            res.json({photoUrl: req.body.photoUrl});
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not create employee'] });
        });
});

router.post('/photo', savePhotoToCloudinary, function (req, res, next) {
    res.end();
});

function addNicknameIfNotExists(req, res, next) {
    if (typeof req.body.nickname === 'undefined') {
        req.body.nickname = req.body.name.split(" ")[0];
    }
    next();
}

module.exports = router;