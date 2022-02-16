const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET
});

const employeeDefaultUrl = 'tzeqj4l6kjyq0jptankn';
const foodPhotoDefaultUrl = 'bazcykvn86tp963v8ocn';
const employeePreset = 'j8gkhubq';
const foodPreset = 'ojh21hnm';

function savePhotoToCloudinary(req, res, next) {
    let currentPreset = foodPreset;
    let currentDefaultUrl = foodPhotoDefaultUrl;
    if (req.baseUrl.includes('employee')) {
        currentDefaultUrl = employeeDefaultUrl;
        currentPreset = employeePreset;
    }
    if (typeof req.body.photo !== 'undefined' && req.body.photo !== '') {
        cloudinary.v2.uploader.upload(req.body.photo, {upload_preset: currentPreset}, function (error, result) {
           res.photoUrl = result.public_id;
           next();
        });
    }
    else {
        res.photoUrl = currentDefaultUrl;
        next();
    }
}

module.exports = {
    savePhotoToCloudinary
};