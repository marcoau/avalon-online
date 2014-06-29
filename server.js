var express = require('express');
var favicon = require('static-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var app = express();

//set default NODE_ENV to 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//load static resources & misc middlewares
app.use(express.static(__dirname + '/client'));
app.use(bodyParser());
app.use(cookieParser());

//simple logger
app.use(function(req, res, next){
  console.log('Request: ' + req.method + ' ' + req.url);
  next();
});

var port = process.env.PORT || 8888;
app.listen(port);
console.log('Avalon server listening at ' + port);
