//jshint esversion:6
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


const intro = "Hit the  + icon to add new notes";
const aboutContent = "The web App is devleoped as a college project not for the actual use now .It is developed by T=the students of first year BSC-CS Viswakarma University Kondhwa Pune. For more infromation contact rahulaauji71@gmail.coms";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}).then(posts=>{
    res.render("home", {
      startingContent: intro,
      posts: posts
      });
  }).catch(err=>console.log(err));
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save().catch(err=>{
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}).then(post=>{
    res.render("post", {
      title: post.title,
      content: post.content
    });
  }).catch(err=> console.log(err));

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});



app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});
