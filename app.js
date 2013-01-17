const express = require('express'),
      http = require('http'),
      https = require('https'),
      fs = require('fs'),
      app = express();

app.use(express.static(__dirname));
app.use(express.bodyParser());
app.set('views', __dirname + "/tpl");

var privateKey = fs.readFileSync('privatekey.pem').toString();
var certificate = fs.readFileSync('certificate.pem').toString();

var credentials = {key: privateKey, cert: certificate};

app.get('/', function(req, res) {
  var dev = (process.env.DEV) ? true: false;
  res.render("home.ejs", {dev: dev, secureurl: process.env.SECUREURL});
});

app.get('/login', function(req, res) {
  if (req.secure) {
    res.render("login.ejs");
  } else {
    res.send("Permission denied.");
  }
})

var port = process.env.PORT || 4567;
var securePort = process.env.SECUREPORT || 4568;

http.createServer(app).listen(port, function() {
  console.log('Listening on port ' + port);
});

https.createServer(credentials, app).listen(securePort, function() {
  console.log('Listening on port ' + securePort);
});