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

router.get('/', getAllFood, function (req, res, next) {
    res.json(res.food);
});

router.get('/:schoolID', getAllFood, getPricesForSchool, function(req, res, next) {
    let resultTable = [];
    res.prices.forEach(function(price) {
        res.food.forEach(function(food) {
            if(price.foodid === food.id) resultTable.push({id: food.id, name: food.name, category: food.category, photourl: food.photourl, price: price.price});
        });
    });
    res.json(resultTable);
});

router.post('/', savePhotoToCloudinary, validateColumns, function (req, res, next) {
    dbHelper.insertIntoTable(database, 'food',
        ['name', 'category', 'photoUrl'], [req.body.name, req.body.category, req.body.photoUrl])
        .then(function () {
            res.end();
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not create food'] });
        });
});

router.get('/foodprice/:schoolID', getPricesForSchool, function(req, res, next) {
    res.json(res.prices);
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
            next();
        })
    }
    else {
        req.body.photoUrl = '';
        next();
    }        
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

function getAllFood(req, res, next) {
    dbHelper.getFromTable(database, 'food', [])
    .then(function(data) {
        res.food = data;
        next();
    })
    .catch(function(error) {
        console.error(error)
        res.statusCode = 500;
        return res.json({ errors: ['Could not get food'] });
    });
}

function getPricesForSchool(req, res, next) {
    if(!isNaN(parseFloat(req.params.schoolID))) {
        dbHelper.getFromTable(database, 'foodprice', ['schoolid = ' + req.params.schoolID])
            .then(function(data) {
                res.prices = data;
                next();
            })
            .catch(function(error) {
                console.error(error)
                res.statusCode = 500;
                return res.json({ errors: ['Could not get food prices'] });
            });
    }
    else {
        res.statusCode = 403;
        return res.json({ errors: ['School ID must be a number'] });
    }
}

module.exports = router;