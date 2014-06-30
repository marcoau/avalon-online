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
    room: roomName,
    players: {},
    teams: [],
    missions: [],
    info: {
      size: room.count,
      missionNo: 0,
      leaderNo: 0,
      leaderPositions: []
    }
  };

  io.in(roomName).emit('S_startGame');
  var roles = shuffleRoles(room.count);
  var positions = shufflePositions(room.count);

  //distribute roles
  _.each(room.players, function(socket, playerId){
    game.players[playerId] = {
      name: players.players[playerId].name,
      socket: socket,
      role: roles.pop(),
      position: positions.pop()
    };
    game.info.leaderPositions.push(playerId);
  });

  var gameInfoFilter = function(playerId){
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
    return gameInfo;
  };

  //send out information
  _.each(room.players, function(socket, playerId){
    var gameInfo = gameInfoFilter(playerId);
    io.to(socket).emit('S_updateGame', {info: gameInfo});
  });

  //first leader starts choosing team
  chooseTeam(game);
};

var chooseTeam = function(game){
  var leaderNo = game.info.leaderNo;
  var leaderId = game.info.leaderPositions[leaderNo % game.info.size];
  //get leader's socket object
  var leaderSocket = players.PtoS[leaderId];
  var leaderSocketId = game.players[leaderId].socket;

  var size = teamSize[game.info.missionNo];

  leaderSocket.on('C_submitTeam', function(data){
    console.log('C_submitTeam');
    var teamMembers = data.chosenTeam;
    var team = {
      leader: leaderId,
      members: teamMembers
    }
    game.teams.push(team);
    //remove listener after usage
    // leaderSocket.removeListener('C_submitTeam');
    voteTeam(game);
  });

  io.to(leaderSocketId).emit('S_beLeader', {teamSize: size});
  //increment leader number
  // game.info.leaderNo++;
};

var voteTeam = function(game){

  console.log('voteTeam');

  var room = game.room;
  var leaderNo = game.info.leaderNo;
  var leaderId = game.teams[leaderNo].leader;
  var chosenTeam = game.teams[leaderNo].members;

  io.in(room).on('C_submitVote', function(data){

  });

  io.to(room).emit('S_voteTeam', {leaderId: leaderId, team: chosenTeam});
};

//temporary
var teamSize = [2,3,2,3,3];

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

/*
1: 'merlin'
2: 'mordred'
3: 'percival'
4: 'assassin'
5: 'warrior'
6: 'villain'
*/