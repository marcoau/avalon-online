angular.module('app.game.lobby', [])
  .controller('GameLobbyCtrl', ['$rootScope', '$scope', '$state', '$location', function($rootScope, $scope, $state, $location){

    console.log($rootScope.user);

    var getUserProfile = function(){
      FB.api('/me', function(response){

        //update user on page
        $rootScope.$apply(function(){
          $rootScope.user = response;
        });

        //once user data is obtained, enter lobby
        $rootScope.Socket.emit('C_enterLobby', {
          playerId: $rootScope.user.id
        });
      });
    };

    //Socket lobby listeners
    $rootScope.Socket.on('S_updatePlayer', function(data){
      $rootScope.user = data.player;
      console.log('USER UPDATE:');
      console.log($rootScope.user);
    });
    $rootScope.Socket.on('S_listRooms', function(data){
      $scope.$apply(function(){
        $scope.rooms = data.rooms;
        console.log('rooms');
        console.log($scope.rooms);
      });
    });

    $scope.openRoom = function(roomName){
      $rootScope.Socket.emit('C_openRoom', {
        playerId: $rootScope.user.id,
        roomName: roomName
      });
    };
    $scope.joinRoom = function(roomName){
      $rootScope.Socket.emit('C_joinRoom', {
        roomName: roomName
      });
    };
    $scope.leaveRoom = function(roomName){
      $rootScope.Socket.emit('C_leaveRoom', {
        roomName: roomName
      });
    };

    $scope.goToRoom = function(){
      $state.go('game.room');
    };

    $scope.quitGame = function(){
      //hack
      $location.path('/');
    };

    //if $rootScope.user is true, used fake login
    if(!$rootScope.user){
      getUserProfile();      
    }else{
      $rootScope.Socket.emit('C_enterLobby', {
        playerId: $rootScope.user.id
      });
    }

  }]);
