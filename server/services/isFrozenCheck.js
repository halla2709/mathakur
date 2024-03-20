const dbHelper = require('../services/databaseHelper');
const database = require('../services/databaseCreator').db;

function findCompanyNameFromBody(req, res, next) {
    res.companyName = req.body.companyName;
    next();
}

function findCompanyIdFromBody(req, res, next) {
    res.companyId = req.body.companyId;
    next();
}

function verifyActiveCompany(req, res, next) {
  let condition;
  if (res.companyId) {
    condition = "id = \'" + res.companyId + "\'";
  }
  else if (req.params.companyId) {
    condition = "id = \'" + req.params.companyId + "\'";
  }
  else if (res.companyName) {
    condition = "name = \'" + res.companyName + "\'";
  }
  else {
    console.error("Could not find company information to look up");
    res.statusCode = 500;
    return res.json({ errors: ['Error while retieving company information'] });
  }

  dbHelper.getFromTable(database, "company", condition)
  .then(function(company) {
    if (company.length === 1) {
      if (company[0].frozen) {
        res.statusCode = 403;
        return res.json({ frozen: true });
      }
      else {
        next();
      }
    }
    else {
      res.statusCode = 500;
      return res.json({ errors: ['Error while retieving company information'] });
    }
  })
  .catch(function(error) {
    console.error(error)            
    res.statusCode = 500;
    return res.json({ errors: ['Could not retrieve company'] });
  });  
}

module.exports = {
  findCompanyIdFromBody, 
  findCompanyNameFromBody,
  verifyActiveCompany
};