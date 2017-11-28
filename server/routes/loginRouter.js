const express = require('express');
const router = express.Router();
const path = require('path');
const randomString = require('random-string');
const md5 = require('md5');
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');

let currentPassword = '';
let waitingPassword = '';
let currentRandomString = '';

router.post('/requestConnection', function (req, res, next) {
    const shoolName = req.body.name;
    currentRandomString = randomString({ length: 10 });
    waitingPassword = req.body.passwordHash;
    currentPassword = req.body.passwordHash + currentRandomString;
    console.log(currentPassword);
    console.log(currentRandomString);
    res.json({ randomString: currentRandomString });
});

router.post('/loginSchool', authenticateConnection, checkSchoolAuthorization, function (req, res, next) {
    const schoolName = req.body.name;
    const passwordHash = req.body.passwordHash;
    const myPasswordHash = md5(currentPassword);
    console.log(passwordHash);
    console.log(myPasswordHash);
    currentPassword = '';
    waitingPassword = '';
    currentRandomString = '';
    res.json({ loggedIn: res.loggedIn });
});

router.post('/signupSchool', authenticateConnection, addSchool, function (req, res, next) {
    currentPassword = '';
    waitingPassword = '';
    currentRandomString = '';
    res.end();
});

function authenticateConnection(req, res, next) {
    console.log(req.body);
    console.log('authenticating ' + req.body.name);
    const passwordHash = req.body.passwordHash;
    const myPasswordHash = md5(currentPassword);
    console.log(passwordHash);
    console.log(myPasswordHash);
    if (passwordHash === myPasswordHash) {
        next();
    }
    else {
        currentPassword = '';
        waitingPassword = '';
        currentRandomString = '';    
        res.statusCode = 401;
        return res.json({ errors: ['Authentication error'] });
    }
}

function addSchool(req, res, next) {
    dbHelper.insertIntoTable(database, 'school',
        ['name', 'password', 'rand'], [req.body.name, req.body.passwordHash, currentRandomString])
        .then(function () {
            next();
        })
        .catch(function (error) {
            console.error(error);
            currentPassword = '';
            waitingPassword = '';
            currentRandomString = '';            
            res.statusCode = 500;
            return res.json({ errors: ['Could not create school'] });
        });
}

function checkSchoolAuthorization(req, res, next) {
    console.log('authorizing ' + req.body.name);
    const schoolName = req.body.name;
    dbHelper.getFromTable(database, 'school', ['name = \'' + schoolName + '\''])
        .then(function (results) {
            const randomString = results[0].rand;
            const rehashed = md5(waitingPassword + randomString);
            if (results[0].password === rehashed) {
                let loggedInSchool = {};
                loggedInSchool.name = results[0].name;
                loggedInSchool.id = results[0].id;
                res.loggedIn = loggedInSchool;
            }
            else {
                res.loggedIn = null;
            }
            next();
        })
        .catch(function (error) {
            console.error(error);
            currentPassword = '';
            waitingPassword = '';
            currentRandomString = '';    
            res.statusCode = 500;
            return res.json({ errors: ['Could not find school'] });
        });
}

module.exports = router;