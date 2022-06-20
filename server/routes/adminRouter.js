const express = require('express');
const router = express.Router();
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');

router.get('/:companyId', function(req, res, next) {
  dbHelper.getFromTable(database, 'administrator', 'companyid = \'' + req.params.companyId + '\' ')
  .then(function (data) {
      data.forEach(admin => {
        delete admin['rand'];
        delete admin['password'];
      });
      res.json(data);
  })
  .catch(function (error) {
      console.error(error)
      res.statusCode = 500;
      return res.json({ errors: ['Could not get admins for company ' + req.params.companyId] });
  });
});

router.delete('/:id', function(req, res, next) {
  dbHelper.deleteFromTable(database, 'administrator', 'id = \'' + req.params.id + '\' ')
  .then(function() {
    res.end();
  })
  .catch(function(error) {
    console.error(error)
    res.statusCode = 500;
    return res.json({ errors: ['Could not remove admin ' + req.params.id] });
  });
});

module.exports = router;
