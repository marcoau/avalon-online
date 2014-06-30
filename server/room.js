var io = require('./../server').io;
var players = require('./../server').players;
var rooms = require('./../server').rooms;

var Lobby = require('./lobby');
var Game = require('./game');

io.on('connection', function(socket){

  //list all rooms for player when he joins
  updateRooms();

  socket.on('C_openRoom', function(data){
    var playerId = data.playerId;
    var roomName = data.roomName;
    this.join(roomName);
    rooms.open[roomName] = {
      name: roomName,
      players: {},
      count: 1
    };
    rooms.open[roomName].players[playerId] = socket.id;

    //update player info for himself
    players.players[playerId].room = rooms.open[roomName];
    updatePlayer(socket);
    //emit new rooms status to all
    updateRooms();
    //emit new room status to room members
    updateRoom(roomName);
  });

  socket.on('C_joinRoom', function(data){
    var roomName = data.roomName;
    var room = rooms.open[roomName];
    var playerId = players.StoP[socket.id];
    this.join(roomName);
    room.players[playerId] = socket.id;
    room.count++;

    //update player info for himself
    players.players[playerId].room = room;
    updatePlayer(socket);
    //emit new rooms status to all
    updateRooms();
    //emit new room status to room members
    updateRoom(roomName);

    //If number of players > 2, startGame
    if(room.count > 2){
      //move room from open to closed
      rooms.closed[roomName] = room;
      delete rooms.open[roomName];

      Game.startGame(roomName);
    }
  });

  socket.on('C_leaveRoom', function(data){
    var roomName = data.roomName;
    var room = rooms.open[roomName];
    var playerId = players.StoP[socket.id];
    this.leave(roomName);

    if(room.players[playerId]){
      delete room.players[playerId];
      room.count--;
    }

    killEmptyRoom(roomName);

    //update player info for himself
    delete players.players[playerId].room;
    updatePlayer(socket);
    //emit new rooms status to all
    updateRooms();
    //emit new room status to room members
    updateRoom(roomName);
  });

  //delete player from all rooms
  socket.on('disconnect', function(){
    var playerId = players.StoP[socket.id];

    for(var roomName in rooms.open){
      var room = rooms.open[roomName];
      if(room.players[playerId]){
        delete room.players[playerId];
        room.count--;

        killEmptyRoom(roomName);
        //emit new room status to room members
        updateRoom(roomName);
      }
    }
    //emit new rooms status to all
    updateRooms();
  });

});

var updateRooms = function(){
  io.emit('S_updateRooms', {
    rooms: rooms.open
  });
};
var updateRoom = function(roomName){
  io.to(roomName).emit('S_updateRoom', {
    room: rooms.open[roomName]
  });
};

var killEmptyRoom = function(roomName){
  if(rooms.open[roomName].count === 0){
    delete rooms.open[roomName];
  }
};

var updatePlayer = function(socket){
  var playerId = players.StoP[socket.id];
  socket.emit('S_updatePlayer', {
    player: players.players[playerId]
  });
};
