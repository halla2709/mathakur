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
    .then(function(data) {
        req.employess = data;
        res.json(req.employess);
    })
    .catch(function(error) {
        console.error(error)
        res.statusCode = 500;
        return res.json({ errors: ['Could not get employees'] });
    });
});

router.patch('/:id', function(req, res, next) {
    const id = req.params.id;
    const newCredit = req.body.newCredit;

    dbHelper.updateCreditOfEmployee(database, id, newCredit)
    .then(function() {
        res.statusCode = 200;
        res.end();
    })
    .catch(function(error) {
        console.error(error)
        res.statusCode = 500;
        return res.json({ errors: ['Could not update employee credit'] });
    });
});

router.post('/', function(req, res, next) {
    if(typeof req.body.credit === 'undefined') {
        req.body.credit = 0;
    }
    dbHelper.insertIntoTable(database, 'employee', 
        ['name', 'credit'], [req.body.name, req.body.credit])
    .then(function() {
        res.end();
    })
    .catch(function(error) {
        console.error(error)
        res.statusCode = 500;
        return res.json({ errors: ['Could not create employee'] });
    });
});

router.post('/photo', function(req, res, next) {
    console.log("received photo");
    console.log(req.body.photo);
    
    cloudinary.v2.uploader.upload(req.body.photo, function(error, result) {
        console.log(error);
        dbHelper.updateEmployeeImage(database, 1, result.public_id);
        console.log(result);
    
    })
    res.end();
});

module.exports = router;