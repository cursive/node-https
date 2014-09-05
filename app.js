// var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};




var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var http = require('http').Server(app);
var https = require('https');
io = require('socket.io')(https);
var routes = require('./routes/index');


/**
Views
**/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
Pages
**/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
Routes
**/
app.use('/', routes);


/*
Errors
*/
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});


module.exports = app;
exports.io=io;

/*
Sockets
*/
io.on('connection', function(socket) {
    console.log('a user connected');
});





/*
Start Server
*/
// http.listen(3000, function() {
//     console.log('Node is running on  \nhttp://localhost:3000 \nhttp://localhost:3000/voice/');
// });

var a = https.createServer(options, function (req, res) {
  res.writeHead(200);
  console.log("222")
  res.end("hello world\n");
}).listen(8000);