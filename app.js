const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const key = "SoYathisismysecretkey";
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mongoose
mongoose.set("strictQuery", false);

// Database URL to connect
const mongoDB = process.env.DB_CONNECTION_STRING;

// Connecting to data base
mongoose
  .connect(mongoDB, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to data base");
  })
  .catch((error) => {
    console.log("Unable to connect", error);
  });

// Creating user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: key,
  encryptedFields: ["password"],
});

const User = mongoose.model("User", userSchema);

// Creating schemas
const postSchema = mongoose.Schema({
  postTitle: String,
  postBody: String,
});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/home", (req, res) => {
  Post.find({})
    .then((results) => {
      res.render("home", {
        posts: results,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const newUser = new User({
    username: name,
    password: password,
  });
  newUser
    .save()
    .then(() => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  User.findOne({ username: name })
    .then((foundUser) => {
      if (foundUser) {
        if (foundUser.password === password) {
          res.redirect("/home");
        } else {
          res.send("Inocrrect username or password");
        }
      } else {
        res.send("Inocrrect username or password");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new Post({
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
  });
  post
    .save()
    .then((results) => {})
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/home");
});

app.get("/posts/:postId", (req, res) => {
  const requestedId = req.params.postId;
  Post.find({}).then((results) => {
    results.forEach((result) => {
      const storedId = result._id;
      if (storedId.equals(requestedId)) {
        res.render("post", {
          storedTitle: result.postTitle,
          storedBody: result.postBody,
        });
      }
    });
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
