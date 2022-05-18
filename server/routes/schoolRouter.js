const express = require('express');
const router = express.Router();
const path = require('path');
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');

router.get('/', getSchools, cleanData, function (req, res, next) {
    res.json(req.schools);
});

router.get('/:id', getSchools, cleanData, function(req, res, next) {
    res.json(req.schools);
});

function getSchools(req, res, next) {
    const id = req.params.id;
    if(typeof id === 'undefined') {
        dbHelper.getFromTable(database, 'school', [])
        .then(function(data) {
            req.schools = data;
            next();
        })
        .catch(function(error) {
            console.error(error)
            res.statusCode = 500;
            return res.json({ errors: ['Could not retrieve school'] });
        });
    }
    else {
        dbHelper.getFromTable(database, 'school', ['id = ' + id])
        .then(function(data) {
            req.schools = data;
            next();
        })
        .catch(function(error) {
            console.error(error)            
            res.statusCode = 500;
            return res.json({ errors: ['Could not retrieve school'] });
        });
    }
}

function cleanData(req, res, next)
{
    for (var i = 0; i < req.schools.length; i++)
    {
        req.schools[i].rand = undefined;
        req.schools[i].password = undefined;
    }
    next();
}

module.exports = router;