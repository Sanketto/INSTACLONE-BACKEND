const upload = require("../middleware/upload");
const {createPost} = require("./post");
const dbConfig = require("../config/db");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
mongoose = require('mongoose')
const url = dbConfig.url;

const baseUrl = "https://insta-backend-qv9o.onrender.com/files/";
mongoose.connect(url+dbConfig.database, { useNewUrlParser: true, useUnifiedTopology: true });

const mongoClient = new MongoClient(url);

const uploadFiles = async (req, res) => {
  try {
    
    await upload(req, res);
   req.body=JSON.parse(req.body.usr);
   req.body.file = baseUrl + req.files[0].filename;
   
    await createPost(req, res);

    if (req.files.length <= 0) {
      return res
        .status(400)
        .send({ message: "You must select at least 1 file." });
    }

    return res.status(200).send({
      message: "Post created succesfully.",
    });

    // console.log(req.file);

    // if (req.file == undefined) {
    //   return res.send({
    //     message: "You must select a file.",
    //   });
    // }

    // return res.send({
    //   message: "File has been uploaded.",
    // });
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send({
        message: "Too many files to upload.",
      });
    }
    return res.status(500).send({
      message: `Error when trying upload many files: ${error}`,
    });

    // return res.send({
    //   message: "Error when trying upload image: ${error}",
    // });
  }
};

const getListFiles = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const images = database.collection(dbConfig.imgBucket + ".files");

  

    const cursor = images.find({});
    images.countDocuments().then((imagesCount)=>{
      console.log(imagesCount)
          }).catch((err)=>{
            return res.status(500).send({
              message: "No files found!",
            });
          });

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};



// const deleteFile = async (filename) => {
 
  
//     console.log("deleteFile");
//       await mongoClient.connect();
//     const database = mongoClient.db(dbConfig.database);
//     const images = database.collection(dbConfig.imgBucket + ".files");
//     const imagesChunk = database.collection(dbConfig.imgBucket + ".chunks");
//     filename = filename.split("/");
//     filename = filename[filename.length-1];
//     console.log(filename);
//     let file = images.deleteOne({filename})
//     console.log(file);
//    return imagesChunk.deleteMany({files_id: file._id})  
  
// }

const download = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucket,
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  uploadFiles,
  getListFiles,
  download
 };
