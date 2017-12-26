const cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: 'dk7mpsfkw',
    api_key: '431766444682953',
    api_secret: 'YOJiDrJckmm7by_FDJVqWQiXcEk'
});
const employeeDefaultUrl = 'tzeqj4l6kjyq0jptankn';
const foodPhotoDefaultUrl = 'bazcykvn86tp963v8ocn';
const employeePreset = 'j8gkhubq';
const foodPreset = 'ojh21hnm';

function savePhotoToCloudinary(req, res, next) {
    let currentPreset = foodPreset;
    let currentDefaultUrl = foodPhotoDefaultUrl;
    if (req.baseUrl.includes('employee')) {
        console.log("EMPLOYEE");
        currentDefaultUrl = employeeDefaultUrl;
        currentPreset = employeePreset;
    }
    if (typeof req.body.photo !== 'undefined' && req.body.photo !== '') {
        console.log("received photo");
        console.log(req.body);

        cloudinary.v2.uploader.upload(req.body.photo, {upload_preset: currentPreset}, function (error, result) {
            res.photoUrl = result.public_id;
            console.log(result);
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