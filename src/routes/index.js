const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");
const postController = require("../controllers/post");

let routes = app => {
  router.get("/", homeController.getHome);

  router.post("/upload", uploadController.uploadFiles);
  router.get("/files", uploadController.getListFiles);
  router.get("/files/:name", uploadController.download);
  router.get("/posts",postController.getPosts);
  router.put("/:id",postController.updatePost);
  router.delete("/:id", postController.deletePost);


  return app.use("/", router);
};

module.exports = routes;

