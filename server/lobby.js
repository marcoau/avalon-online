var io = require('./../server').io;
var players = require('./../server').players;

var Room = require('./room');
var Game = require('./game');

io.on('connection', function(socket){
  console.log('socket connected: ' + socket.id);

  console.log(socket.handshake.address);

  socket.on('C_enterLobby', function(data){
    var playerId = data.playerId;
    if(!players.players[playerId]){
      //player not entered lobby yet
      players.players[playerId] = {
        id: playerId,
        socketId: socket.id
      };
      players.StoP[socket.id] = playerId;
    }else{
      //player already entered lobby
      socket.emit('S_denyFromLobby', {});
    }

    console.log('players updated:');
    console.log(players);
  });

  //delete players from list
  socket.on('disconnect', function(){
    console.log('socket disconnected: ' + socket.id);
    var playerId = players.StoP[socket.id];

    delete players.players[playerId];
    delete players.StoP[socket.id];

    console.log('players updated:');
    console.log(players);
  });
 
});
