const express = require('express');
const router = express.Router();

router.get('/notes', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

router.post('/notes', function (req, res, next) {
    res.sendFile(__dirname + '/wow.html');
});

module.exports = router;