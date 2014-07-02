var _ = require('lodash');

var io = require('./../../server').io;
var players = require('./../../server').players;
var rooms = require('./../../server').rooms;

var Lobby = require('./../lobby');
var Room = require('./../room');

var GameMain = require('./../game');
var GameMission = require('./game_mission');

var assassinAction = exports.assassinAction = function(game){
  _.each(game.players, function(player, playerId){
    if(player.role === 'assassin'){
      //assassin logic
      var assassinId = playerId;
      var assassinSocket = players.PtoS[assassinId];
      assassinSocket.on('C_submitKill', function(data){
        var targetId = data.target;
        if(game.players[targetId].role === 'merlin'){
          //assassin success; evil wins
          game.results.assassinSuccess = true;
          game.results.goodWins = false;
          resolveGame(game);
        }else{
          //assassin fail; good wins
          game.results.assassinSuccess = false;
          game.results.goodWins = true;
          resolveGame(game);
        }
        delete assassinSocket._events.C_submitKill;
      });
      assassinSocket.emit('S_assassinActs');
    }
  });
};

var resolveGame = exports.resolveGame = function(game){
  //decide victory
  var room = game.room;
  var goodWins = game.results.goodWins;
  io.to(room).emit('S_resolveGame', {goodWins: goodWins});

  //save game result to database
};
