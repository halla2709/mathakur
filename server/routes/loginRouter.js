const express = require('express');
const router = express.Router();
const path = require('path');
const randomString = require('random-string');
const md5 = require('md5');
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');

const masterKeyHash = md5(process.env.MASTER_SIGNUP_KEY || 'rubyhallaunnur');
let companyAuth = {};
let adminAuth = {};

router.post('/requestSignupConnection', function(req, res, next) {
    if (req.body.masterKeyHash === masterKeyHash)
    {
        companyAuth.randomString = randomString({ length: 10 });
        companyAuth.hashedPassword = req.body.companyPassHash;
        adminAuth.randomString = randomString({ length: 10 });
        adminAuth.hashedPassword = req.body.adminPassHash;
        res.json({ companyRandomString: companyAuth.randomString, adminRandomString: adminAuth.randomString });
    }
    else
    {
        res.statusCode = 401;
        return res.json({ errors: ["Master key not correct"]});
    }
});

router.post('/requestCompanyConnection', function (req, res, next) {
    companyAuth.randomString = randomString({ length: 10 });
    companyAuth.hashedPassword = req.body.passwordHash;
    res.json({ companyRandomString: companyAuth.randomString });
});

router.post('/requestAdminConnection', function (req, res, next) {
    adminAuth.randomString = randomString({ length: 10 });
    adminAuth.hashedPassword = req.body.adminPassHash;
    res.json({ adminRandomString: adminAuth.randomString });
});

router.post('/signupCompany', authenticateCompanyConnection, authenticateAdminConnection, addCompany, addAdmin, function (req, res, next) {
    companyAuth = {};
    adminAuth = {};
    res.json({ company: req.body.companyName });
});

router.post('/loginCompany', authenticateCompanyConnection, checkCompanyCredientials, function (req, res, next) {
    companyAuth = {};
    res.json({ loggedIn: res.loggedIn });
});

router.post('/signupAdmin', authenticateAdminConnection, addAdmin, function (req, res, next) {
    adminAuth = {};
    res.json({ name: req.body.name });
});

router.post('/loginUser', authenticateAdminConnection, checkUserCredientials, function (req, res, next) {
    adminAuth = {};
    res.json({ loggedIn: res.loggedIn });
});

function authenticateCompanyConnection(req, res, next) {
    const passwordHash = req.body.companyPassHash;
    const myPasswordHash = md5(companyAuth.hashedPassword + companyAuth.randomString);
    if (passwordHash === myPasswordHash) {
        companyAuth.finalPassword = myPasswordHash;
        next();
    }
    else {
        companyAuth = {};
        res.statusCode = 401;
        return res.json({ errors: ['Company authentication error'] });
    }
}

function authenticateAdminConnection(req, res, next) {
    const passwordHash = req.body.adminPassHash;
    const myPasswordHash = md5(adminAuth.hashedPassword + adminAuth.randomString);
    if (passwordHash === myPasswordHash) {
        adminAuth.finalPassword = myPasswordHash;
        next();
    }
    else {
        adminAuth = {};
        res.statusCode = 401;
        return res.json({ errors: ['Admin authentication error'] });
    }
}

function addCompany(req, res, next) {
    dbHelper.insertIntoTableReturningID(database, 'company',
        ['name', 'password', 'rand', 'allowfundsbelowzero'], [req.body.companyName, companyAuth.finalPassword, companyAuth.randomString, req.body.allowFundsBelowZero])
        .then(function (id) {
            req.body.companyId = id.id;
            next();
        })
        .catch(function (error) {
            console.error(error);
            companyAuth = {};
            res.statusCode = 500;
            return res.json({ errors: ['Could not create company'] });
        });
}

function addAdmin(req, res, next) {
    dbHelper.insertIntoTable(database, 'administrator',
        ['name', 'password', 'rand', 'username', 'companyid'],
        [req.body.adminName, adminAuth.finalPassword, adminAuth.randomString, req.body.adminUser, req.body.companyId])
        .then(function () {
            next();
        })
        .catch(function (error) {
            console.error(error);
            adminAuth = {};
            res.statusCode = 500;
            return res.json({ errors: ['Could not create admin'] });
        });
}

function checkCompanyCredientials(req, res, next) {
    const companyName = req.body.companyName;
    dbHelper.getFromTable(database, 'company', ['name = \'' + companyName + '\''])
        .then(function (results) {
            const randomString = results[0].rand;
            const rehashed = md5(companyAuth.hashedPassword + randomString);
            if (results[0].password === rehashed) {
                res.loggedIn = {
                    name: results[0].name,
                    id: results[0].id,
                    allowFundsBelowZero: results[0].allowfundsbelowzero == true // gæti verið undefined
                }
            }
            else {
                res.loggedIn = null;
            }
            next();
        })
        .catch(function (error) {
            console.error(error);
            companyAuth = {};
            res.statusCode = 500;
            return res.json({ errors: ['Could not find company'] });
        });
}

function checkUserCredientials(req, res, next) {
    dbHelper.getFromTable(database, 'administrator', ['username = \'' + req.body.adminUser + '\''])
        .then(function (results) {
            if (results.length == 0)
            {
                hashedCompanyPassword = '';
                companyAuth.randomString = '';
                res.statusCode = 500;
                return res.json({ errors: ['Could not find administrator'] });                
            }
            
            const randomString = results[0].rand;
            const rehashed = md5(adminAuth.hashedPassword + randomString);
            if (results[0].password === rehashed) {
                if (results[0].companyid === req.body.companyId) {
                    res.loggedIn = results[0].name;
                }
                else {
                    res.loggedIn = null;
                }
               
            }
            else {
                res.loggedIn = null;
                hashedCompanyPassword = '';
                companyAuth.randomString = '';
            }
            next();

        })
        .catch(function (error) {
            console.error(error);
            hashedCompanyPassword = '';
            companyAuth.randomString = '';
            res.statusCode = 500;
            return res.json({ errors: ['Could not find administrator'] });
        });
}

module.exports = router;