const express = require("express");
const bodyParser = require("body-parser");
const socket = require('socket.io');
const app = express();
const sentMsgs = [];
const activeUsers = new Set();
const Users = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

const server = app.listen(3000, function(err) {
  if (!err) {
    console.log("Server is running on port 3000");
  } else {
    console.log(err);
  }
});
const io = socket(server);

io.on('connection', function(socket) {
  console.log("Made socket connection");
});

  app.get('/', function(req, res) {
    res.sendFile(__dirname + "/home.html");
  });

  app.get('/signin', function(req, res) {
    res.sendFile(__dirname + "/signin.html");
  });

  app.get("/register", function(req, res) {
    res.sendFile(__dirname + "/register.html");
  });

  app.get("/chat", function(req, res) {
    res.sendFile(__dirname + "/index.html")
  });

  app.post("/register", function(req, res) {
    const userData = {
      fullName: req.body.fName + " " + req.body.lName,
      email: req.body.email,
      pass: req.body.password
    };

    Users.push(userData);
    console.log(Users);
    res.redirect("/chat");
  });

  app.post("/signin", function(req, res) {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    Users.forEach(function(user) {
      if (userEmail === user.email) {
        if (userPassword === user.pass) {
          res.redirect("/chat");
        } else {
          res.redirect("/signin");
        }
      }
    });
  });
