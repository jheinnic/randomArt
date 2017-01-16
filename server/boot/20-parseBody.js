var multer = require('multer');

module.exports = function(app) {
   app.use(multer().any()); // for parsing multipart/form-data
}
