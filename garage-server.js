var first_arg = process.argv[2];
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
if (first_arg !== 'dummy') {
  var rpio = require('rpio');
  rpio.open(40, rpio.INPUT, rpio.PULL_UP);
  rpio.open(36, rpio.INPUT, rpio.PULL_UP);
}
var express = require("express");
var app = express();
var server = require("http").createServer(app);(app);
var auth = require("./auth");
var io = require('socket.io')(server);


require("console-stamp")(console, "[HH:MM:ss]");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

/* Endpoints */

app.get("/api/garage/authenticate", auth.staticUserAuth, function(req, res) {
  res.end('{"status" : "valid"}');
});



app.get("/", function(req, res) {
  res.render("login.html");
});

app.get("/authenticated", function(req, res) {
  res.render("index.html");
});

app.get("/api/doors/status", auth.staticUserAuth, function(req, res) {

  const rightDoorOpen = false;
  const rightDoorClosed = true;
  const leftDoorClosed = false;
  const leftDoorOpen = true;  
  if(first_arg !== 'dummy'){
    rightDoorOpen = rpio.read(40);
    rightDoorClosed = rpio.read(36);
    leftDoorClosed = rpio.read(32);
    leftDoorOpen = rpio.read(16);
  }

  
  res.setHeader("Content-Type", "application/json");
  res.end('{"success" : "State read", "rightDoorOpen" : ' + rightDoorOpen + ', "rightDoorClosed" : ' + rightDoorClosed + ', "leftDoorClosed" : ' + leftDoorClosed + ', "leftDoorOpen" : ' + leftDoorOpen + '}');
});


app.get("/api/door/left/toggle", auth.staticUserAuth, function(req, res) {

  res.end('{"success" : "true"}');

  setTimeout(() => {
    io.emit('left-door-status', 'open');
  }, 5000);


});


// rpio.poll(pin, cb[, direction])  <- read values for pin and execute callbacks




// Start server
var port = process.env.PORT || 8000;
server.listen(port, function() {
  console.log("GaragePi listening on port:", port);
});


io.on('connection', function(socket){
  console.log('a user connected');
});


function intIsZero(int) {
  if (int === 0) {
    return true;
  }
  if (int === 1) {
    return false;
  }
}