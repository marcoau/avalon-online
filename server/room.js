var io = require('./../server').io;
var players = require('./../server').players;
var rooms = require('./../server').rooms;

io.on('connection', function(socket){

  //list all rooms for player when he joins
  listRooms();

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
    players.players[playerId].room = roomName;
    updatePlayer(socket);
    //emit new rooms status to all
    listRooms();
  });

  socket.on('C_joinRoom', function(data){
    var roomName = data.roomName;
    var playerId = players.StoP[socket.id];
    this.join(roomName);
    rooms.open[roomName].players[playerId] = socket.id;
    rooms.open[roomName].count++;

    //update player info for himself
    players.players[playerId].room = roomName;
    updatePlayer(socket);
    //emit new rooms status to all
    listRooms();
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

    //update player info for himself
    delete players.players[playerId].room;
    updatePlayer(socket);
    //emit new rooms status to all
    listRooms();
  });

  //delete player from all rooms
  socket.on('disconnect', function(){
    var playerId = players.StoP[socket.id];

    for(var roomName in rooms.open){
      var room = rooms.open[roomName];
      if(room.players[playerId]){
        delete room.players[playerId];
        room.count--;
      }
    }
    //emit new rooms status to all
    listRooms();
  });

});

var listRooms = function(){
  console.log('listRooms');
  io.emit('S_listRooms', {
    rooms: rooms.open
  });
};

var updatePlayer = function(socket){
  var playerId = players.StoP[socket.id];
  socket.emit('S_updatePlayer', {
    player: players.players[playerId]
  });
};
