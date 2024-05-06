const express = require('express');
const router = express.Router();
const path = require('path');
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');
const cloudinary = require("cloudinary");
const savePhotoToCloudinary = require("../services/cloudinaryHelper").savePhotoToCloudinary;
const frozenCheck = require('../services/isFrozenCheck').verifyActiveCompany;

router.get('/', getAllProducts, function (req, res, next) {
    res.json(res.product);
});

router.get('/:companyId', frozenCheck, getAllProducts, getPricesForCompany, function (req, res, next) {
    let resultTable = [];
    res.prices.forEach(function (price) {
        res.product.forEach(function (product) {
            if (price.productid === product.id) resultTable.push({ id: product.id, name: product.name, category: product.category, photourl: product.photourl, price: price.price, active: price.active });
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
    let newPhotoUrl = res.photoUrl;
    const newName = req.body.newName;
    const newStatus = req.body.newStatus;

    dbHelper.updateProductPrice(database, companyId, id, newPrice, newStatus)
        .then(function () {
            if (!(typeof req.body.photo !== 'undefined' && req.body.photo !== '')) {
                newPhotoUrl = undefined;
            }

            dbHelper.updateProduct(database, id, newName, newPhotoUrl)
                .then(function () {
                    res.statusCode = 200;
                    res.json({ photoUrl: newPhotoUrl });
                })
                .catch(function (error) {
                    console.error(error)
                    res.statusCode = 500;
                    return res.json({ errors: ['Could not update product'] });
                });
        })
        .catch(function (error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not update product price'] });
        });
});

router.delete('/:product/:companyId', function (req, res, next) {
    dbHelper.deleteFromTable(database, 'productprice', 'productid = \'' + req.params.product + '\' AND companyid = \'' + req.params.companyId + '\'')
        .then(function () {
            res.statusCode = 200;
            res.end();
        })
        .catch(function (error) {
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
    let activeFilter = '';
    if(req.query.active) {
        activeFilter = 'AND active = true';
    }
    dbHelper.getFromTable(database, 'productprice', 'companyid = \'' + req.params.companyId + '\' ' + activeFilter)
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
                ['companyid', 'productid', 'price', 'active'], [req.body.companyId, id.id, req.body.price, req.body.active])
                .then(function () {
                })
                .catch(function (error) {
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