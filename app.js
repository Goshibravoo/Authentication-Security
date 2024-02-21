//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save().then (function(){
    res.send("Succesfully secrets");
  }).catch (function(err){
    res.send(err);
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username })
    .then(foundUser => {
      if (!foundUser) {
        // User not found
        res.status(404).send("User not found");
      } else {
        // User found, now compare passwords
        console.log("Found user:", foundUser);
        console.log("Input password:", password);
        console.log("User password:", foundUser.password);

        if (foundUser.password === password) {
          // Password matches
          res.send("Login successful. Welcome to the secrets page!");
        } else {
          // Incorrect password
          res.status(401).send("Incorrect password");
        }
      }
    })
    .catch(err => {
      console.error("Error finding user:", err);
      res.status(500).send("Internal Server Error");
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// const username = req.body.username;
// const password = req.body.password;
//
// User.findOne({email: username}).then (function(){
//   res.render(err);
// }).catch(function(err)
//       res.render("secrets");
//     }
// });
