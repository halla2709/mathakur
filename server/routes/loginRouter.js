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
    currentRandomString = randomString({ length: 10 });
    waitingPassword = req.body.passwordHash;
    currentPassword = req.body.passwordHash + currentRandomString;
    console.log(currentPassword);
    console.log(currentRandomString);
    res.json({ randomString: currentRandomString });
});

router.post('/loginSchool', authenticateConnection, checkSchoolAuthorization, function (req, res, next) {
    currentPassword = '';
    waitingPassword = '';
    currentRandomString = '';
    res.json({ loggedIn: res.loggedIn });
});

router.post('/signupSchool', authenticateConnection, addSchool, function (req, res, next) {
    currentPassword = '';
    waitingPassword = '';
    currentRandomString = '';
    res.json({ school: req.body.name });
});

router.post('/signupAdmin', authenticateConnection, addAdmin, function (req, res, next) {
    currentPassword = '';
    waitingPassword = '';
    currentRandomString = '';
    res.json({ schoolName: req.body.schoolName, name: req.body.name });
});

router.post('/loginUser', authenticateConnection, checkUserCredientials, function (req, res, next) {
    currentPassword = '';
    waitingPassword = '';
    currentRandomString = '';
    res.json({ loggedIn: res.loggedIn });
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

function addAdmin(req, res, next) {
    dbHelper.insertIntoTable(database, 'administrator',
        ['name', 'password', 'rand', 'username', 'schoolName'],
        [req.body.name, req.body.passwordHash, currentRandomString, req.body.username, req.body.schoolName])
        .then(function () {
            next();
        })
        .catch(function (error) {
            console.error(error);
            currentPassword = '';
            waitingPassword = '';
            currentRandomString = '';
            res.statusCode = 500;
            return res.json({ errors: ['Could not create admin'] });
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
                res.loggedIn = results[0].name;
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

function checkUserCredientials(req, res, next) {
    console.log('checking ' + req.body.username + ' and ' + req.body.schoolName);
    dbHelper.getFromTable(database, 'administrator', ['username = \'' + req.body.username + '\''])
        .then(function (results) {
            const randomString = results[0].rand;
            const rehashed = md5(waitingPassword + randomString);
            if (results[0].password === rehashed) {
                if (results[0].schoolname === req.body.schoolName) {
                    res.loggedIn = results[0].name;
                }
                else {
                    console.log('school in db ' + results[0].schoolname);
                    console.log('school in req ' + req.body.schoolName);
                    res.loggedIn = null;
                }
               
            }
            else {
                res.loggedIn = null;
                console.log("here");
                currentPassword = '';
                waitingPassword = '';
                currentRandomString = '';
            }
            next();

        })
        .catch(function (error) {
            console.error(error);
            currentPassword = '';
            waitingPassword = '';
            currentRandomString = '';
            res.statusCode = 500;
            return res.json({ errors: ['Could not find administrator'] });
        });
}

module.exports = router;