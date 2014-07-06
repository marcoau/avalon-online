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
    if(!rooms.open[roomName] && !rooms.closed[roomName]){
      this.join(roomName);
      rooms.open[roomName] = {
        name: roomName,
        players: {},
        count: 1
      };
      //SUPER HACKY
      rooms.open[roomName].players[playerId] = {
        name: players.players[playerId].name,
        socket: socket.id
      };

      //update player info for himself
      players.players[playerId].room = rooms.open[roomName];
      updatePlayer(socket);
      //emit new rooms status to all
      updateRooms();
      //emit new room status to room members
      updateRoom(roomName);
    }else{
      //room with same name exists already
      socket.emit('S_roomNameTaken');
    }
  });

  socket.on('C_joinRoom', function(data){
    var roomName = data.roomName;
    var room = rooms.open[roomName];
    var playerId = players.StoP[socket.id];
    this.join(roomName);
    //SUPER HACKY
    room.players[playerId] = {
      name: players.players[playerId].name,
      socket: socket.id
    };
    room.count++;

    //update player info for himself
    players.players[playerId].room = room;
    updatePlayer(socket);
    //emit new rooms status to all
    updateRooms();
    //emit new room status to room members
    updateRoom(roomName);

    //If number of players > 4, startGame
    if(room.count > 2){
      //move room from open to closed
      rooms.closed[roomName] = room;
      delete rooms.open[roomName];
      //emit new rooms status to all
      updateRooms();
      //emit new room status to room members
      updateRoom(roomName);

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
    console.log('disconnect: ' + socket.id);
    var playerId = players.StoP[socket.id];

    for(var roomName in rooms.open){
      var room = rooms.open[roomName];
      if(room.players[playerId]){
        delete room.players[playerId];
        room.count--;

        killEmptyOpenRoom(roomName);
        //emit new room status to room members
        updateRoom(roomName);
      }
    }

    //check closed rooms (game in progress rooms) too
    for(var roomName in rooms.closed){
      var room = rooms.closed[roomName];
      if(room.players[playerId]){
        delete room.players[playerId];
        room.count--;

        killEmptyClosedRoom(roomName);
        //emit new room status to room members
        updateRoom(roomName);
      }
    }

    //delete player from server
    delete players.players[playerId];
    delete players.PtoS[playerId];
    delete players.StoP[socket.id];

    //emit new rooms status to all
    updateRooms();
  });

});

var updateRooms = exports.updateRooms = function(){
  io.emit('S_updateRooms', {
    rooms: rooms.open
  });
};
var updateRoom = exports.updateRoom = function(roomName){
  io.to(roomName).emit('S_updateRoom', {
    room: rooms.open[roomName]
  });
};

var killEmptyOpenRoom = exports.killEmptyOpenRoom = function(roomName){
  if(rooms.open[roomName].count === 0){
    delete rooms.open[roomName];
  }
};

var killEmptyClosedRoom = exports.killEmptyClosedRoom = function(roomName){
  if(rooms.closed[roomName].count === 0){
    delete rooms.closed[roomName];
  }
};


var updatePlayer = function(socket){
  var playerId = players.StoP[socket.id];
  socket.emit('S_updatePlayer', {
    player: players.players[playerId]
  });
};
