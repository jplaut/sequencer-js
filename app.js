var express = require('express'),
    fs = require('fs'),
    port = process.env.PORT || 4569,
    app = express(),
    http = require('http').createServer(app).listen(port),
    mongoose = require('mongoose'),
    MongoStore = require('connect-mongo')(express),
    db = mongoose.connect('mongodb://localhost/sequencer-dev').connection;

var userSchema, User;

if (process.env.DEV) {
  var privateKey = fs.readFileSync('privatekey.pem').toString(),
      certificate = fs.readFileSync('certificate.pem').toString(),
      credentials = {key: privateKey, cert: certificate},
      securePort = process.env.SECUREPORT || 4565,
      https = require('https').createServer(credentials, app).listen(securePort);
}

app.use(express.cookieParser(process.env.COOKIESECRET));
app.use(express.session({
  key: "sessID", 
  secret: process.env.COOKIESECRET, 
  cookie: {maxAge: 604800},
  store: new MongoStore({
    url: "mongodb://localhost/sequencer-dev"
  })
}));
app.use(express.static(__dirname));
app.set('views', __dirname + "/tpl");
//app.use(app.router);

db.once('open', function() {
  userSchema = mongoose.Schema({
    name: String,
    username: String,
    password: String
  });

  User = mongoose.model('User', userSchema);
});

app.get('/', function(req, res) {
  var name;

  if (req.session.user) {
    user = User.findOne({username: req.session.user}, 'name', function(err, result) {
      name = (err) ? null : result.name;
    });
  } else {
    name = null;
  }

  var dev = (process.env.DEV) ? true: false;
  res.render("home.ejs", {dev: dev, secureurl: process.env.SECUREURL, name: name});
});

app.get('/login', function(req, res) {
  if (req.secure) {
    res.render("login.ejs", {secureurl: process.env.SECUREURL});
  } else {
    res.send("Permission denied.");
  }
})

app.post('/login', function(req, res) {
  if (req.session && req.headers['x-requested-with'] == 'XMLHttpRequest') {
    res.contentType('json');
    res.send({ data: "test" });
    console.log("YES");
  }
});