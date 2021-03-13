//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://admin-sondre:test123@cluster0.rsua0.mongodb.net/UserDB?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const QuickTest = new mongoose.Schema({
  title: {
    type: String,
    required: [true],
  },
  content: {
    type: String,
    required: [true],
  },
});

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

const User = new mongoose.model("User", userSchema);

/*app.post("/", (req, res) => {
  test = Test({ title: "TestTitle", content: "TestContent" });
  test.save();
  console.log(test);
  res.send(test);
});*/

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
        console.log(newUser);
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
