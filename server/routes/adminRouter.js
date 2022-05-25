const express = require('express');
const router = express.Router();
const database = require('../services/databaseCreator').db;
const dbHelper = require('../services/databaseHelper');

router.get('/:schoolId', function(req, res, next) {
  dbHelper.getFromTable(database, 'administrator', ['schoolid = \'' + req.params.schoolId + '\' '])
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
      return res.json({ errors: ['Could not get admins for school ' + req.params.schoolId] });
  });
});

module.exports = router;
