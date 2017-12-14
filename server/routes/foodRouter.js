const express = require('express');
const router = express.Router();
const path = require('path');
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');
const cloudinary = require("cloudinary");
const savePhotoToCloudinary = require("../services/cloudinaryHelper").savePhotoToCloudinary;

router.get('/', getAllFood, function (req, res, next) {
    res.json(res.food);
});

router.get('/:schoolName', getAllFood, getPricesForSchool, function (req, res, next) {
    let resultTable = [];
    res.prices.forEach(function (price) {
        res.food.forEach(function (food) {
            if (price.foodid === food.id) resultTable.push({ id: food.id, name: food.name, category: food.category, photourl: food.photourl, price: price.price });
        });
    });
    res.json(resultTable);
});

router.post('/', savePhotoToCloudinary, validateColumns, insertIntoTables, function (req, res, next) {
    res.statusCode = 200;
    res.json({ photoUrl: res.photourl });
});

router.patch('/:schoolName/:id', savePhotoToCloudinary, function (req, res, next) {
    const schoolName = req.params.schoolName;
    const id = req.params.id;
    const newPrice = req.body.newPrice;
    const newPhotoUrl = req.body.photoUrl;

    dbHelper.updateFoodPrice(database, schoolName, id, newPrice)
        .then(function () {
            dbHelper.updateFoodImage(database, id, newPhotoUrl)
                .then(function () {
                    res.statusCode = 200;
                    res.json({ photoUrl: newPhotoUrl });
                })
                .catch(function (error) {
                    console.error(error)
                    res.statusCode = 500;
                    return res.json({ errors: ['Could not update food image'] });
                });
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not update food price'] });
        });
});

router.get('/foodprice/:schoolName', getPricesForSchool, function (req, res, next) {
    res.json(res.prices);
});

router.post('/photo', savePhotoToCloudinary, function (req, res, next) {
    res.end();
});

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
        .then(function (data) {
            res.food = data;
            next();
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not get food'] });
        });
}

function getPricesForSchool(req, res, next) {
    dbHelper.getFromTable(database, 'foodprice', ['schoolName = \'' + req.params.schoolName + '\' '])
        .then(function (data) {
            res.prices = data;
            next();
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not get food prices'] });
        });
}

function insertIntoTables(req, res, next) {
    dbHelper.insertIntoTableReturningID(database, 'food',
    ['name', 'category', 'photoUrl'], [req.body.name, req.body.category, res.photoUrl])
    .then(function (id) {
        dbHelper.insertIntoTable(database, 'foodprice', 
        ['schoolname', 'foodid', 'price'], [req.body.school, id.id, req.body.price])
            .then(function() {
                console.log("ADDED FOOD PRICE");
            })
            .catch(function(error){
                console.error(error);
                res.statusCode = 500;
                return res.json({ errors: ['Could not add food price'] });
            })
        next();
    })
    .catch(function (error) {
        console.error(error)
        res.statusCode = 500;
        return res.json({ errors: ['Could not create food'] });
    });
}

module.exports = router;