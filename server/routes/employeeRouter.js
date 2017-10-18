const express = require('express');
const router = express.Router();
const path = require('path');
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');
const cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: 'dk7mpsfkw',
    api_key: '431766444682953',
    api_secret: 'YOJiDrJckmm7by_FDJVqWQiXcEk'
});

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

router.patch('/:id', function (req, res, next) {
    const id = req.params.id;
    const newCredit = req.body.newCredit;

    dbHelper.updateCreditOfEmployee(database, id, newCredit)
        .then(function () {
            res.statusCode = 200;
            res.end();
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not update employee credit'] });
        });
});

router.post('/', savePhotoToCloudinary, addNicknameIfNotExists, function (req, res, next) {
    if (typeof req.body.credit === 'undefined') {
        req.body.credit = 0;
    }

    dbHelper.insertIntoTable(database, 'employee',
        ['name', 'nickname', 'credit', 'photoUrl'], [req.body.name, req.body.nickname, req.body.credit, req.body.photoUrl])
        .then(function () {
            res.end();
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

function savePhotoToCloudinary(req, res, next) {
    if (typeof req.body.photo !== 'undefined' && req.body.photo !== '') {
        console.log("received photo");
        console.log(req.body);

        cloudinary.v2.uploader.upload(req.body.photo, {upload_preset: "j8gkhubq"}, function (error, result) {
            console.log(error);
            req.body.photoUrl = result.public_id;
            console.log(result);
            next();
        });
    }
    else {
        req.body.photoUrl = '';
        next();
    }
}

function addNicknameIfNotExists(req, res, next) {
    if (typeof req.body.nickname === 'undefined') {
        req.body.nickname = req.body.name.split(" ")[0];
    }
    next();
}

module.exports = router;