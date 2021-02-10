const express = require("express");
const bodyParser = require("body-parser");
const socket = require('socket.io');
const app = express();
const sentMsgs = [];
const activeUsers = new Set();
const Users = [];
const ejs = require('ejs');
const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost:27017/usersDB");

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    pass: String,
    messages: [String]
});

const User = new mongoose.model("User", userSchema);

app.set('view engine', 'ejs');
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

  socket.on("activeUser", function(userId){
    socket.userId = userId;
    activeUsers.add(userId);
    console.log(userId);
    activeUsers.forEach(function(socket){
      User.find({_id: socket}, function(err, found){
        if (found){
          console.log(found);
          io.emit("activeUser", found);
        }
      })
    });
  });
  socket.on("disconnect", function(){
    io.emit("user disconnect", socket.userId);
    activeUsers.delete(socket.userId);
  });
  socket.on("publicMessage", function(msg){
    User.findOne({_id: msg.userId}, function(err, found){
      if(found){
          found.messages.push(msg.body)
          socket.broadcast.emit("publicMessage", msg, found.fullName);
      }
    })
  });
});
  app.get("/chat", function(req, res){
    res.render("index", {username: "Test", userId: "What"});
  })

  app.get('/', function(req, res) {
    res.sendFile(__dirname + "/home.html");
  });

  app.get('/signin', function(req, res) {
    res.sendFile(__dirname + "/signin.html");
  });

  app.get("/register", function(req, res) {
    res.sendFile(__dirname + "/register.html");
  });



  app.post("/register", function(req, res) {
    const userData = new User({
      fullName: req.body.fName + " " + req.body.lName,
      email: req.body.email,
      pass: req.body.password,
      messages:[]
    });
    userData.save();
    res.render("index", {username: userData.fullName, userId: userData._id});
  });

  app.post("/signin", function(req, res) {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    User.findOne({email: userEmail},  function(err, found){
      if(found){
        if (userPassword === found.pass) {
          res.render("index", {username: found.fullName, userId: found._id})
        } else {
          res.redirect("/signin");
        }
      }
    });
  });
