var _ = require('lodash');

var io = require('./../server').io;
var players = require('./../server').players;
var rooms = require('./../server').rooms;

var Lobby = require('./lobby');
var Room = require('./room');

io.on('connection', function(socket){

});

exports.startGame = function(roomName){
  var room = rooms.closed[roomName];
  var game = {
    players: {}
  };

  io.in(roomName).emit('S_startGame');
  var characters = shuffle(room.count);

  //distribute roles
  _.each(room.players, function(socket, playerId){
    game.players[playerId] = {
      socket: socket,
      role: characters.pop()
    };
  });

  var gameStatusFilter = function(playerId){
    var ownRole = game.players[playerId].role;
    //deep clone the game status with lodash
    var gameStatus = _.cloneDeep(game);

    _.each(gameStatus.players, function(playr, playrId){
      console.log(playr);

      if(playerId === playrId){
        //himself
        gameStatus.me = playr;
      }else{
        //not himself
        if(playr.role === 'percival' || playr.role === 'warrior'){
          //characters not known to anyone
          playr.role = 'unknown';
        }else if(playr.role === 'assassin' || playr.role === 'villain'){
          //characters known to merlin or evil
          if(ownRole === 'merlin' || ownRole === 'mordred' || ownRole === 'assassin' || ownRole === 'villain'){
            playr.role = 'evil';
          }else{
            playr.role = 'unknown';
          }
        }else if(playr.role === 'merlin'){
          //character known to percival
          if(ownRole !== 'percival'){
            playr.role = 'unknown';
          }
        }else if(playr.role === 'mordred'){
          //character known to evil
          if(ownRole === 'assassin' || ownRole === 'villain'){
            playr.role = 'evil';
          }else{
            playr.role = 'unknown';
          }
        }
      }
    });
    return gameStatus;
  };

  //send out information
  _.each(room.players, function(socket, playerId){
    var gameStatus = gameStatusFilter(playerId);
    io.to(socket).emit('S_updateGame', {status: gameStatus});
  });

};

var shuffle = function(num){
  var characters = ['merlin', 'mordred', 'percival', 'assassin', 'warrior', 'warrior', 'villain', 'warrior', 'warrior', 'villain'];
  // var characters = [1,2,3,4,5,5,6,5,5,6];
  var o = characters.slice(0, num);
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

var gameStatusFilter = function(player){

};

/*
1: 'merlin'
2: 'mordred'
3: 'percival'
4: 'assassin'
5: 'warrior'
6: 'villain'

*/