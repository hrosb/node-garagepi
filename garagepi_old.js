var first_arg = process.argv[2];
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
if (first_arg !== 'dummy') {
  var GPIO = require("onoff").Gpio;
  var rpio = require('rpio');
  rpio.open(40, rpio.INPUT, rpio.PULL_UP);
  rpio.open(36, rpio.INPUT, rpio.PULL_UP);
  rpio.open(32, rpio.INPUT, rpio.PULL_UP);
  rpio.open(16, rpio.INPUT, rpio.PULL_UP);
}
var express = require("express");
var app = express();
var server = require("http").Server(app);
var auth = require("./auth");

require("console-stamp")(console, "[HH:MM:ss]");


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
  res.render("index.html");
});

var state = "closed";
app.get("/api/doors/status", auth.staticUserAuth, function(req, res) {
  const rightDoorOpen = rpio.read(40);
  const rightDoorClosed = rpio.read(36);
  const leftDoorClosed = rpio.read(32);
  const leftDoorOpen = rpio.read(16);
  
  res.setHeader("Content-Type", "application/json");
  res.end('{"success" : "State read", "rightDoorOpen" : ' + rightDoorOpen + ', "rightDoorClosed" : ' + rightDoorClosed + ', "leftDoorClosed" : ' + leftDoorClosed + ', "leftDoorOpen" : ' + leftDoorOpen + '}');
});

app.get("/api/garage/picture", auth.staticUserAuth, function(req, res) {
  takePicture();
  setTimeout(() => {
    res.end('{"success" : "Picture taken"}');
  }, 1000);
});

app.get("/api/door/:side", auth.staticUserAuth, function(req, res) {
  
  side = req.params.side;

  state = state == "closed" ? "open" : "closed";

  // hardcode to closed for now until reed switch
  state = "closed";
  res.setHeader("Content-Type", "application/json");
  res.end('{"success" : "Updated Successfully", "status" : "' + state + '"}');
  toggleDoor(side);
});


function outputSequence(pin, seq, timeout) {
  var gpio = new GPIO(4, "out");
  gpioWrite(gpio, pin, seq, timeout);
}

function toggleDoor(side){
  var gpio;
  var pin;
  switch (side) {
    case 'left':
      
      gpio = new GPIO(4, "out");
      pin = 7;

      break;

    case 'right':
    
      gpio = new GPIO(17, "out");
      pin = 11;

      break;      

  }

  gpioWrite(gpio, pin, "10", 1000);

}

function gpioWrite(gpio, pin, seq, timeout) {
  if (!seq || seq.length <= 0) {
    console.log("closing pin:", pin);
    gpio.unexport();
    return;
  }

  var value = seq.substr(0, 1);
  seq = seq.substr(1);
  setTimeout(function() {
    console.log("gpioWrite, value:", value, " seq:", seq);
    gpio.writeSync(value);
    gpioWrite(gpio, pin, seq, timeout);
  }, timeout);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

function takePicture(){
  var imgPath = path.join(__dirname, "public/images");
  var cmd = "raspistill -w 640 -h 480 -q 80 -o " + imgPath + "/garage.jpg";
  var exec = require("child_process").exec;
  exec(cmd, function(error, stdout, stderr) {
    if (error !== null) {
      console.log("exec error: " + error);
      return;
    }
    console.log("snapshot created...");
  });
}


/* io.on("connection", function(socket) {
  console.log("a user connected");
  startTakingSnaps = true;
  takeSnaps();

  socket.on("disconnect", function() {
    console.log("user disconnected");
    startTakingSnaps = false;
  });
}); */

var port = process.env.PORT || 8000;
server.listen(port, function() {
  console.log("GaragePi listening on port:", port);
});
