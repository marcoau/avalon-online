var _ = require('lodash');

var io = require('./../../server').io;
var players = require('./../../server').players;
var rooms = require('./../../server').rooms;

var Lobby = require('./../lobby');
var Room = require('./../room');

var GameMain = require('./../game');
var GameMission = require('./game_mission');

var resolveGame = exports.resolveGame = function(game){
  console.log('resolveGame');
  //decide victory
  var room = game.room;
  var goodWins = game.info.successMissionTally > 2 ? true : false;
  io.to(room).emit('S_resolveGame', {goodWins: goodWins});

  //save game result to database
};
