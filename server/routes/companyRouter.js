const express = require('express');
const router = express.Router();
const path = require('path');
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');

router.get('/', getCompanies, cleanData, function (req, res, next) {
    res.json(req.companies);
});

router.get('/:id', getCompanies, cleanData, function(req, res, next) {
    res.json(req.companies);
});

router.patch('/:id', function(req, res, next) {
    dbHelper.updateAllowFundsBelowZero(database, req.params.id, req.body.allowFundsBelowZero)
    .then(function() {
        res.end();
    })
    .catch(function(error) {
        res.statusCode = 500;
        return res.json({ errors: ['Could not update settings'] });
    });
});

function getCompanies(req, res, next) {
    const id = req.params.id;
    if(typeof id === 'undefined') {
        dbHelper.getFromTable(database, 'company', [])
        .then(function(data) {
            req.companies = data;
            next();
        })
        .catch(function(error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not retrieve company'] });
        });
    }
    else {
        dbHelper.getFromTable(database, 'company', ['id = \'' + id + '\''])
        .then(function(data) {
            req.companies = data;
            next();
        })
        .catch(function(error) {
            console.error(error)            
            res.statusCode = 500;
            return res.json({ errors: ['Could not retrieve company'] });
        });
    }
}

function cleanData(req, res, next)
{
    for (var i = 0; i < req.companies.length; i++)
    {
        req.companies[i].rand = undefined;
        req.companies[i].password = undefined;
    }
    next();
}

module.exports = router;