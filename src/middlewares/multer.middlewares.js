import multer from "multer"; ///express-fileupload 

//  multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination directory where the uploaded file will be stored
    cb(null, './public/temp');
  },
  filename: function (req, file, cb) {
    // Set the filename of the uploaded file
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({storage: storage});
