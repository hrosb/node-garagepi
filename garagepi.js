// Settings
var pins = {
  right: {
    name: 'right',
    openSensor: 16,
    closedSensor: 32,
    relay: 7
  },
  left: {
    name: 'left',
    openSensor: 40,
    closedSensor: 36,
    relay: 11,
  }
}
var first_arg = process.argv[2];

var rpio = require("rpio");

var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var auth = require("./auth");
var PiCamera = require('pi-camera');
var camera = new PiCamera({
  mode: 'photo',
  output: path.join(__dirname, "public/images"),
  width: 640,
  height: 480,
  timestamp: true,
  timeout:0
});

var io = require('socket.io')(server);

if(first_arg === "dummy"){
  rpio.init({mock: 'raspi-zero-w'});
  rpio.on('warn', function() {});
}

// Setup
rpio.open(pins.left.openSensor, rpio.INPUT, rpio.PULL_UP);
rpio.open(pins.left.closedSensor, rpio.INPUT, rpio.PULL_UP);
rpio.open(pins.left.relay, rpio.OUTPUT, rpio.HIGH);
rpio.open(pins.right.closedSensor, rpio.INPUT, rpio.PULL_UP);
rpio.open(pins.right.openSensor, rpio.INPUT, rpio.PULL_UP);
rpio.open(pins.right.relay, rpio.OUTPUT, rpio.HIGH);



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

function isZero(int){
  if(int === 0){
    return true;
  }
  return false;
}

app.get("/api/doors/status", auth.staticUserAuth, function(req, res) {
  
  const leftDoorOpen = isZero(rpio.read(pins.left.openSensor));
  const leftDoorClosed = isZero(rpio.read(pins.left.closedSensor));
  const rightDoorOpen = isZero(rpio.read(pins.right.openSensor));
  const rightDoorClosed = isZero(rpio.read(pins.right.closedSensor));

  res.setHeader("Content-Type", "application/json");
  res.end(
    '{"success" : "State read", "leftDoorOpen" : ' +
      leftDoorOpen +
      ', "leftDoorClosed" : ' +
      leftDoorClosed +
      ', "rightDoorClosed" : ' +
      rightDoorClosed +
      ', "rightDoorOpen" : ' +
      rightDoorOpen +
      "}"
  );
});

app.get("/api/door/:side/toggle", auth.staticUserAuth, function(req, res) {
  side = req.params.side;
  triggerRelay(side);
  res.end('{"success" : "true"}');
});

app.get("/api/garage/picture", auth.staticUserAuth, function(req, res) {
  takePicture();
  res.end('{"success" : "Picture taken"}');
});

function pollSensors(pin) {
  /*
   * Wait for a small period of time to avoid rapid changes which
   * can't all be caught with the 1ms polling frequency.  If the
   * pin is no longer down after the wait then ignore it.
   */
  //rpio.msleep(200);

  //if (rpio.read(pin)) {
  //  return
  //};

  //socket.emit('state-change', "OpenSensor true on pin - " + pin);

  console.log('Button event on pin %d, is now %d', pin, rpio.read(pin));
  
}

//rpio.poll(pins.right.openSensor, pollSensors, rpio.POLL_HIGH);
//rpio.poll(pins.right.closedSensor, pollSensors, rpio.POLL_DOWN);
//rpio.poll(pins.left.openSensor, pollSensors, rpio.POLL_DOWN);
//rpio.poll(pins.right.closedSensor, pollSensors, rpio.POLL_DOWN);

// Start server
var port = process.env.PORT || 8000;
server.listen(port, function() {
  console.log("GaragePi listening on port:", port);
});

/* io.on("connection", function(socket) {
  console.log("a user connected");
}); */


function triggerRelay(side){  
  /* On for 1 second */
  rpio.write(pins[side].relay, rpio.LOW);
  rpio.sleep(1);
  
  /* Off for half a second (500ms) */
  rpio.write(pins[side].relay, rpio.HIGH);
  rpio.sleep(1);

}

// Bytt til: https://github.com/stetsmando/pi-camera
function takePicture(){
  camera.snap()
  .then((result) => {
      socket.emit('photo-taken', true);
  })
  .catch((error) => {
     // Handle your error
  });
}