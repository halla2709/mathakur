const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/notes', function (req, res, next) {
    res.sendFile('index.html', { root: path.resolve(__dirname, '../views')});
});

router.post('/notes', function (req, res, next) {
    res.sendFile('wow.html', { root: path.resolve(__dirname, '../views')});
});

module.exports = router;