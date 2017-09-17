const express = require('express');
const router = express.Router();
const path = require('path');
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');

router.get('/', getSchools, function (req, res, next) {
    res.json(req.schools);
});

router.get('/:id', getSchools, function(req, res, next) {
    res.json(req.schools);
});

router.post('/', addSchool, function (req, res, next) {
    res.end();
});

function addSchool(req, res, next) {
    dbHelper.insertIntoTable(database, 'school', 
        ['name', 'password'], [req.body.name, req.body.password])
    .then(function() {
        next();
    })
    .catch(function(error) {
        console.error(error)
        res.statusCode = 500;
        return res.json({ errors: ['Could not create school'] });
    });
}

function getSchools(req, res, next) {
    const id = req.params.id;
    console.log(id);
    if(typeof id === 'undefined') {
        dbHelper.getFromTable(database, 'school', [])
        .then(function(data) {
            req.schools = data;
            next()
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

module.exports = router;