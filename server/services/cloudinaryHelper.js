const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET
});

const employeeDefaultUrl = 'tzeqj4l6kjyq0jptankn';
const productPhotoDefaultUrl = 'bazcykvn86tp963v8ocn';
const employeePreset = 'j8gkhubq';
const productPreset = 'ojh21hnm';

function savePhotoToCloudinary(req, res, next) {
    let currentPreset = productPreset;
    let currentDefaultUrl = productPhotoDefaultUrl;
    let subfolder = '/products';
    if (req.baseUrl.includes('employee')) {
        currentDefaultUrl = employeeDefaultUrl;
        currentPreset = employeePreset;
        subfolder = '/employees';
    }
    if (req.body.companyId) {
        let folder = req.body.companyId + subfolder;
        if (typeof req.body.photo !== 'undefined' && req.body.photo !== '') {
            cloudinary.v2.uploader.upload(req.body.photo, {upload_preset: currentPreset, folder: folder}, function (error, result) {
               res.photoUrl = result.public_id;
               next();
            });
        }
        else {
            res.photoUrl = currentDefaultUrl;
            next();
        }
    }
    else {
        console.error("Company ID missing when trying to save photo to cloudinary!! Will not save.");
        res.photoUrl = currentDefaultUrl;
        next();
    }
}

module.exports = {
    savePhotoToCloudinary
};