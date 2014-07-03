var _ = require('lodash');

var io = require('./../../server').io;
var players = require('./../../server').players;
var rooms = require('./../../server').rooms;

var Lobby = require('./../lobby');
var Room = require('./../room');

var GameMain = require('./../game');
var GameMission = require('./game_mission');

var assassinAction = exports.assassinAction = function(game){
  GameMain.updateGameInfo(game);

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
  var roomName = game.room;
  var room = rooms.closed[roomName];
  var goodWins = game.results.goodWins;

  GameMain.updateGameInfo(game);

  io.to(roomName).emit('S_resolveGame', {goodWins: goodWins});

  var stayingPlayers = [];
  var leavingPlayers = [];

  console.log('next...');

  _.each(game.players, function(player, playerId){
    var playerSocket = players.PtoS[playerId];
    playerSocket.on('C_stayInRoom', function(){
      console.log('C_stayInRoom');
      stayingPlayers.push(playerId);
      if(stayingPlayers.length === game.info.size){
        //all players stay; start a new game; all current game data in memory lost
        GameMain.startGame(roomName);
      }

      delete playerSocket._events.S_leaveRoomAfterGame;
      delete playerSocket._events.S_stayInRoom;
    });
    playerSocket.on('C_leaveRoomAfterGame', function(){
      //one player leaves; room open again
      console.log('C_leaveRoomAfterGame');
      this.leave(roomName);
      //update room data
      console.log(room);
      delete room.players[playerId];
      room.count--;

      if(leavingPlayers.length === 0){
        rooms.open[roomName] = room;
        delete rooms.closed[roomName];
      }

      Room.killEmptyRoom(roomName);

      console.log('rooms');
      console.log(rooms);
      console.log('room');
      console.log(room);

      //change of room member status:
      //emit new rooms status to all
      Room.updateRooms();
      //emit new room status to room members
      Room.updateRoom(roomName);

      delete playerSocket._events.S_leaveRoomAfterGame;
      delete playerSocket._events.S_stayInRoom;
    });
  });

  //save game result to database
};
