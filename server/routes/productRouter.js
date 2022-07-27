const express = require('express');
const router = express.Router();
const path = require('path');
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');
const cloudinary = require("cloudinary");
const savePhotoToCloudinary = require("../services/cloudinaryHelper").savePhotoToCloudinary;

router.get('/', getAllProducts, function (req, res, next) {
    res.json(res.product);
});

router.get('/:companyId', getAllProducts, getPricesForCompany, function (req, res, next) {
    let resultTable = [];
    res.prices.forEach(function (price) {
        res.product.forEach(function (product) {
            if (price.productid === product.id) resultTable.push({ id: product.id, name: product.name, category: product.category, photourl: product.photourl, price: price.price });
        });
    });
    res.json(resultTable);
});

router.post('/', savePhotoToCloudinary, validateColumns, insertIntoTables, function (req, res, next) {
    res.statusCode = 200;
    res.json({ photoUrl: res.photoUrl });
});

router.patch('/:companyId/:id', savePhotoToCloudinary, function (req, res, next) {
    const companyId = req.params.companyId;
    const id = req.params.id;
    const newPrice = req.body.newPrice;
    const newPhotoUrl = res.photoUrl;
    const newName = req.body.newName;

    dbHelper.updateProductPrice(database, companyId, id, newPrice)
        .then(function () {
            dbHelper.updateProductImage(database, id, newPhotoUrl)
                .then(function () {
                    dbHelper.updateProductName(database, id, newName)
                    .then(function () {
                        res.statusCode = 200;
                        res.json({ photoUrl: newPhotoUrl });
                    })
                    .catch(function (error) {
                        console.error(error)
                        res.statusCode = 500;
                        return res.json({ errors: ['Could not update product name'] });
                    });
                    
                })
                .catch(function (error) {
                    console.error(error)
                    res.statusCode = 500;
                    return res.json({ errors: ['Could not update product image'] });
                });
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not update product price'] });
        });
});

router.patch('/price/:companyId/:id', function(req, res, next) {
    const companyId = req.params.companyId;
    const id = req.params.id;
    const newPrice = req.body.newPrice;

    dbHelper.updateProductPrice(database, companyId, id, newPrice)
        .then(function () {
            res.statusCode = 200;
            res.end();
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not update product price'] });
        });
});

router.get('/productprice/:companyId', getPricesForCompany, function (req, res, next) {
    res.json(res.prices);
});

router.delete('/:product/:companyId', function(req, res, next) {
    dbHelper.deleteFromTable(database, 'productprice', 'productid = \'' + req.params.product + '\' AND companyid = \'' + req.params.companyId + '\'')
    .then(function() {
        res.statusCode = 200;
        res.end();
    })
    .catch(function(error) {
        console.error(error);
        res.statusCode = 500;
        return res.json({ errors: ['Could not delete product'] });
    })
});

function validateColumns(req, res, next) {
    if (typeof req.body.name === 'undefined') {
        res.statusCode = 500;
        return res.json({ errors: ['Could not create product without name'] });
    }
    if (typeof req.body.category === 'undefined') {
        req.body.category = '';
    }
    next();
}

function getAllProducts(req, res, next) {
    dbHelper.getFromTable(database, 'product')
        .then(function (data) {
            res.product = data;
            next();
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not get product'] });
        });
}

function getPricesForCompany(req, res, next) {
    dbHelper.getFromTable(database, 'productprice', 'companyid = \'' + req.params.companyId + '\' ')
        .then(function (data) {
            res.prices = data;
            next();
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not get product prices'] });
        });
}

function insertIntoTables(req, res, next) {
    dbHelper.insertIntoTableReturningID(database, 'product',
    ['name', 'category', 'photoUrl'], [req.body.name, req.body.category, res.photoUrl])
    .then(function (id) {
        dbHelper.insertIntoTable(database, 'productprice', 
        ['companyid', 'productid', 'price'], [req.body.companyId, id.id, req.body.price])
            .then(function() {
            })
            .catch(function(error){
                console.error(error);
                res.statusCode = 500;
                return res.json({ errors: ['Could not add product price'] });
            })
        next();
    })
    .catch(function (error) {
        console.error(error)
        res.statusCode = 500;
        return res.json({ errors: ['Could not create product'] });
    });
}

module.exports = router;