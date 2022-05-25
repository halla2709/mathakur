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

router.get('/:schoolId', getAllFood, getPricesForSchool, function (req, res, next) {
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
    res.json({ photoUrl: res.photoUrl });
});

router.patch('/:schoolId/:id', savePhotoToCloudinary, function (req, res, next) {
    const schoolId = req.params.schoolId;
    const id = req.params.id;
    const newPrice = req.body.newPrice;
    const newPhotoUrl = res.photoUrl;

    dbHelper.updateFoodPrice(database, schoolId, id, newPrice)
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

router.patch('/price/:schoolId/:id', function(req, res, next) {
    const schoolId = req.params.schoolId;
    const id = req.params.id;
    const newPrice = req.body.newPrice;

    dbHelper.updateFoodPrice(database, schoolId, id, newPrice)
        .then(function () {
            res.statusCode = 200;
            res.end();
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not update food price'] });
        });
});

router.get('/foodprice/:schoolId', getPricesForSchool, function (req, res, next) {
    res.json(res.prices);
});

router.delete('/:food/:schoolId', function(req, res, next) {
    dbHelper.deleteFromTable(database, 'foodprice', ['foodid = \'' + req.params.food + '\' AND schoolid = \'' + req.params.schoolId + '\''])
    .then(function() {
        res.statusCode = 200;
        res.end();
    })
    .catch(function(error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ errors: ['Could not delete food'] });
    })
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
    dbHelper.getFromTable(database, 'foodprice', ['schoolid = \'' + req.params.schoolId + '\' '])
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
        ['schoolid', 'foodid', 'price'], [req.body.schoolId, id.id, req.body.price])
            .then(function() {
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