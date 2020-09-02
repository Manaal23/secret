//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB" , { useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email : String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRETKEY , encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  const newUser = new User({
    email: username,
    password: password
  });
  newUser.save()
  res.redirect("/login");

});

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err,resultFound){
    if (err){
      console.log(err);
    }else{
      if (resultFound){
        if (resultFound.password === password){
          res.render("secrets");
        }
      }
    }
  });

});




app.listen(3000, function(req,res){
  console.log("Server is running at port 3000");
})
