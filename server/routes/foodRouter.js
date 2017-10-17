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
    dbHelper.getFromTable(database, 'food', [])
    .then(function(data) {
        req.food = data;
        res.json(req.food);
    })
    .catch(function(error) {
        console.error(error)
        res.statusCode = 500;
        return res.json({ errors: ['Could not get food'] });
    });
});

router.post('/', savePhotoToCloudinary, validateColumns, function (req, res, next) {
    dbHelper.insertIntoTable(database, 'employee',
        ['name', 'category', 'photoUrl'], [req.body.name, req.body.category, req.body.photoUrl])
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
    if (req.body.photo !== 'undefined' && req.body.photo !== '') {
        console.log("received photo");
        console.log(req.body.photo);

        cloudinary.v2.uploader.upload(req.body.photo, function (error, result) {
            console.log(error);
            req.body.photoUrl = result.public_id;
            console.log(result);
        })
    }
    else
        req.body.photoUrl = '';
    next();
}

function validateColumns(req, res, next) {
    if (typeof req.body.name === 'undefined') {
        res.statusCode = 500;
        return res.json({ errors: ['Could not create food without name'] });
    }
    if (typeof req.body.category === 'undefined') {
        req.body.category = '';
    }
    next();
}

module.exports = router;