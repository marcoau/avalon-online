var express = require('express');
var favicon = require('static-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var app = express();

//Socket.IO setup
var server = require('http').Server(app);
var io = exports.io = require('socket.io')(server);

//game server current storage
//player storage: PlayerId to Socket (NOT JUST ID!) & SocketId to PlayerId
var players = exports.players = {players: {}, PtoS: {}, StoP: {}};
var rooms = exports.rooms = {open: {}, closed: {}};

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

//Socket.IO logics - must be loaded in right order
require('./server/room');
require('./server/lobby');
require('./server/game');

var port = process.env.PORT || 8888;
server.listen(port);
console.log('Avalon server listening at ' + port);
