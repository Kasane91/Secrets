//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rsua0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const userSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true],
  },
  password: {
    type: String,
    required: [true],
  },
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  console.log(req.body);
  User.findOne({ user: req.body.username }, (err, foundUser) => {
    if (foundUser) {
      if (req.body.password === foundUser.password) {
        console.log(foundUser);
        res.redirect("/secrets");
      } else {
        res.send("Password did not match");
      }
    } else {
      console.log("We could not find a user with that username");
    }
  });
});

//REGISTER USER ENDPOINT
app
  .route("/register")

  .get((req, res) => {
    res.render("register");
  })

  .post((req, res) => {
    newUser = User({
      user: req.body.username,
      password: req.body.password,
    });
    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/secrets");
      }
    });
  });

app.get("/secrets", (req, res) => {
  res.render("secrets");
});

let PORT = "";
process.env.PORT ? (PORT = process.env.PORT) : (PORT = 3000);

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
