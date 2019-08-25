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

var port = process.env.PORT || 8000;
server.listen(port, function() {
  console.log("GaragePi listening on port:", port);
});
