const dbConfig = require("../config/db");
const Post = require("../module/Post")



const getPosts = async (req, res) => {
     Post.find({})
    .then((posts)=>{
       return res.status(200).json(posts)
    }).catch((err)=>{
        return res.status(500).send({
          message: "No files found!",
        });
      });
}

const createPost = (req, res) => {
    
    const post= new Post(req.body);

    //Insert ot MongoDb
    post.save(post).then(data=>200)
    .catch((err)=>err)
    
}

const updatePost = async (req, res)=>{
    const {id} = req.params;
   req.body= Object.keys(req.body)[0]
   console.log(id);
    //console.log(JSON.parse(req.body));
    Post.findByIdAndUpdate(id, JSON.parse(req.body), {useFindAndMondify: true}).then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
          });
        } else {
            console.log(data);
            res.send({ message: "Tutorial was updated successfully." });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Tutorial with id=" + id
        });
      });
}

const deletePost = async (req, res)=>{
  const {id} = req.params;

  console.log(id);
  // Post.findOneAndDelete({_id: id},{useFindAndMondify: true})
  // .then(()=>res.status(200).send({
  //   message: `Post of deleted`,
  //   id: _id
  // })).catch(err=>res.status(500).send({message: "somethong went wrong"}))

 Post.findByIdAndRemove({_id: id})
      .then(async(data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
          });
        } else {
          res.send({
            message: "Post was deleted successfully!",
            id: data._id
          });
        }
        return
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Post with id=" + id
        });
      });

}

module.exports = {createPost, getPosts, updatePost, deletePost}