module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    files: [
      "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.2/angular.js",
      "https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.4.2/angular-ui-router.min.js",
      "https://rawgit.com/tinusn/cloudinary-angular/master/dist/cloudinary-angular.min.js",
      "./app/node_modules/angular-md5/angular-md5.js",
      "https://cdnjs.cloudflare.com/ajax/libs/angular-mocks/1.8.2/angular-mocks.js",
      "./app/scripts/app.js",
      "./app/scripts/services/serverCommunication.js",
      "./app/scripts/controllers/admin.js",
      "./app/scripts/controllers/dashboard.js",
      "./app/scripts/services/session.js",
      "./spec/adminSpec.js",
      "./spec/dashboardSpec.js"
    ]
  })
}