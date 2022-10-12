const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const cloudinary = require("cloudinary");
const pgp = require('pg-promise')({
  query: e => {
      console.log('QUERY:', e.query);
  }
});
const conn =
  {
      connectionString: 'postgres://usermathakur:admin@localhost:5432/mathakurrestored'
  };
let db;
const cloudName = 'dk7mpsfkw'; //process.env.CLOUDINARY_CLOUDNAME;
cloudinary.config({
    cloud_name: cloudName,
    api_key: '431766444682953', //process.env.CLOUDINARY_APIKEY,
    api_secret: 'YOJiDrJckmm7by_FDJVqWQiXcEk' //process.env.CLOUDINARY_APISECRET
});

let databaseEmployeePhotos = {};
let cloudinaryAssets = { 'noFolder': [], 'products': [] };
let allCompanies = [];
let databaseProductPhotos = [];

function getBaseId(publicId) {
  let idParts = publicId.split('/');
  if (idParts.length === 3) {
    return idParts[2];
  }
  else {
    return publicId;
  }
}

function getCloudinaryIds() {
  return new Promise((resolve, reject) => {
    cloudinary.v2.search.expression().execute().then(function(result) {
      for (let i = 0; i < result.resources.length; i++) {
        let resource = result.resources[i];
        let baseId = getBaseId(resource.public_id);
        let myResource = { baseId: baseId, folder: resource.folder, publicId: resource.public_id };
        if (resource.folder) {
          let folderParts = resource.folder.split('/');
          if (folderParts.length == 2) {
            const company = folderParts[0];
            const type = folderParts[1];
            if (type === 'employees') {
              if (cloudinaryAssets[company]) {
                cloudinaryAssets[company].push(myResource)
              }
              else {
                cloudinaryAssets[company] = [myResource];
              }
            }
            else {
              cloudinaryAssets.products.push(myResource);
            }
          }
          else {
            cloudinaryAssets.noFolder.push(myResource);
          }
        }
        else {
            cloudinaryAssets.noFolder.push(myResource);
        }
      }
      console.log(cloudinaryAssets);
      resolve();
    })
    .catch(function(error) {
      console.error("Could not get cloudinary information");
      console.error(error);
      reject(error);
    });
  });
}

function getEmployeeDbInfo() {
  return new Promise((resolve, reject) => { 
    db.query("SELECT photourl,companyid FROM employee")
    .then(function(result) {
      for (var i = 0; i < result.length; i++) {
        let baseId = getBaseId(result[i].photourl);
        if (!result[i].companyid) {
          console.warn("Employee without company ID has " + result[i].photourl + "!!");
        }
        else if (databaseEmployeePhotos[result[i].companyid]) {
          databaseEmployeePhotos[result[i].companyid].push(baseId);
        }
        else {
          databaseEmployeePhotos[result[i].companyid] = [ baseId ];
          allCompanies.push(result[i].companyid);
        }
      }
      resolve();
    })
    .catch(function(error) {
      console.error("Could not get database employee information");
      console.error(error);
      reject(error);
    });
  });
}

function getProductDbInfo() {
  return new Promise((resolve, reject) => { 
    db.query("SELECT photourl FROM product")
    .then(function(result) {
      databaseProductPhotos = result;
      resolve();
    })
    .catch(function(error) {
      console.error("Could not get database product information");
      console.error(error);
      reject(error);
    });
  });
}

console.log("Using db: " + conn.connectionString);
console.log("Using cloudinary: " + cloudName);

let toRemove = [];
rl.question("Correct information? If not exit now.", function() {
  console.log("Let's go...");
  db = pgp(conn);
  Promise.all([getCloudinaryIds(), getEmployeeDbInfo(), getProductDbInfo()])
  .then(function() {
    let noFolderAssets = cloudinaryAssets.noFolder;
    console.log("No folder assets " + noFolderAssets.length);
    for (var i = 0; i < allCompanies.length; i++) {
      const companyid = allCompanies[i];
      let cloudinaryEmployees = [];
      for (var j = 0; j < databaseEmployeePhotos[companyid].length; j++) {
        const assetId = databaseEmployeePhotos[companyid][j];
        let found = false;
        if (cloudinaryAssets[companyid]) {
          cloudinaryEmployees = cloudinaryAssets[companyid];
          for (var k = 0; k < cloudinaryEmployees.length; k++) {
            if (assetId === cloudinaryEmployees[k].baseId) {
              found = true;
              cloudinaryEmployees.splice(k, k+1);
              break;
            }
          }
        }
        if (!found) {
          for(var k = 0; k < noFolderAssets.length; k++) {
            if (assetId === noFolderAssets[k].baseId) {
              console.log("Found " + assetId + " for employee in no folder");
              noFolderAssets.splice(k, k+1);
              break;
            }
          }
        }
      }
      console.log("employees of " + companyid + " to remove");
      console.log(cloudinaryEmployees);
    }

    let cloudinaryProducts = cloudinaryAssets.products;
    for (var j = 0; j < databaseProductPhotos.length; j++) {
      const assetId = getBaseId(databaseProductPhotos[j].photourl);
      let found = false;
      for (var k = 0; k < cloudinaryProducts.length; k++) {
        if (assetId === cloudinaryProducts[k].baseId) {
          found = true;
          cloudinaryProducts.splice(k, k+1);
          break;
        }
      }
      if (!found) {
        for(var k = 0; k < noFolderAssets.length; k++) {
          if (assetId === noFolderAssets[k].baseId) {
            console.log("Found " + assetId + " for employee in no folder");
            noFolderAssets.splice(k, k+1);
            break;
          }
        }
      }
    }
    console.log("products to remove");
    console.log(cloudinaryProducts);
    console.log("no folder items to remove");
    console.log(noFolderAssets);
  });
});