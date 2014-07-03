var _ = require('lodash');

var io = require('./../server').io;
var players = require('./../server').players;
var rooms = require('./../server').rooms;

var Lobby = require('./lobby');
var Room = require('./room');

var GameVoting = require('./game/game_voting');
var GameMission = require('./game/game_mission');
var GameEnding = require('./game/game_ending');

io.on('connection', function(socket){

});

exports.startGame = function(roomName){
  var room = rooms.closed[roomName];
  var game = {
    room: roomName,
    players: {},
    teams: [],
    missions: [],
    info: {
      size: room.count,
      //voting info
      leaderNo: 0,
      leaderPositions: [],
      rejectedTeamTally: 0,
      //mission info
      missionNo: 0,
      successMissionTally: 0,
      failMissionTally: 0
    },
    results: {}
  };

  io.in(roomName).emit('S_startGame');
  var roles = shuffleRoles(room.count);
  var positions = shufflePositions(room.count);

  //distribute roles
  _.each(room.players, function(socket, playerId){
    var playerData = {
      name: players.players[playerId].name,
      socket: socket,
      role: roles.pop(),
      position: positions.pop()
    };
    playerData.isGood = roleIsGood[playerData.role];

    game.players[playerId] = playerData;
    game.info.leaderPositions.push(playerId);
  });
  //send out information
  updateGameInfo(game);
  //first leader starts choosing team
  GameVoting.chooseTeam(game);
};

var gameInfoFilter = function(game, playerId){
  var ownRole = game.players[playerId].role;
  //deep clone the game info with lodash
  var gameInfo = _.cloneDeep(game);

  _.each(gameInfo.players, function(playr, playrId){
    if(playerId === playrId){
      //himself
      gameInfo.me = playr;
    }else{
      //not himself
      if(playr.role === 'percival' || playr.role === 'warrior'){
        //characters not known to anyone
        playr.role = 'unknown';
        delete playr.isGood;
      }else if(playr.role === 'assassin' || playr.role === 'villain'){
        //characters known to merlin or evil
        if(ownRole === 'merlin' || ownRole === 'mordred' || ownRole === 'assassin' || ownRole === 'villain'){
          playr.role = 'evil';
        }else{
          playr.role = 'unknown';
          delete playr.isGood;
        }
      }else if(playr.role === 'merlin'){
        //character known to percival
        if(ownRole !== 'percival'){
          playr.role = 'unknown';
          delete playr.isGood;
        }
      }else if(playr.role === 'mordred'){
        //character known to evil
        if(ownRole === 'assassin' || ownRole === 'villain'){
          playr.role = 'evil';
        }else{
          playr.role = 'unknown';
          delete playr.isGood;
        }
      }
    }
  });
  return gameInfo;
};

var updateGameInfo = exports.updateGameInfo = function(game){
  //send out information
  _.each(game.players, function(player, playerId){
    var gameInfo = gameInfoFilter(game, playerId);
    io.to(player.socket).emit('S_updateGame', {info: gameInfo});
  });
};

exports.statusLogger = function(game){
  console.log('Leader No.: ' + game.info.leaderNo);
  console.log('Mission No.: ' + game.info.missionNo);
  console.log('All chosen teams:');
  console.log(game.teams);
  console.log('All finished missions:');
  console.log(game.missions);
};

var shuffleRoles = function(num){
  var roles = ['merlin', 'mordred', 'percival', 'assassin', 'warrior', 'warrior', 'villain', 'warrior', 'warrior', 'villain'];
  // var roles = [1,2,3,4,5,5,6,5,5,6];
  var o = roles.slice(0, num);
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};
var shufflePositions = function(num){
  var positions = [0,1,2,3,4,5,6,7,8,9];
  var o = positions.slice(0, num);
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

var roleIsGood = {
  'merlin': true,
  'mordred': false,
  'percival': true,
  'assassin': false,
  'warrior': true,
  'villain': false
};


/*
1: 'merlin'
2: 'mordred'
3: 'percival'
4: 'assassin'
5: 'warrior'
6: 'villain'
*/
