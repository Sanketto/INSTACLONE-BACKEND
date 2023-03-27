const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/db");

var storage = new GridFsStorage({
  url: dbConfig.url + dbConfig.database,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
   // console.log(file);
    const match = ["image/png", "image/jpeg"];
  

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-10x-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: dbConfig.imgBucket,
      filename: `${Date.now()}-10x-${file.originalname}`,
    };
  }
});
var uploadFiles = multer({ storage: storage }).array("file", 10);
// var uploadFiles = multer({ storage: storage }).single("file");
// console.log("storage");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
