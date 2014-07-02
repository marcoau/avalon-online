angular.module('app.game.lobby', [])
  .controller('GameLobbyCtrl', ['$rootScope', '$scope', '$state', '$location', function($rootScope, $scope, $state, $location){

    var getUserProfile = function(){
      FB.api('/me', function(response){

        //update user on page
        $rootScope.$apply(function(){
          $rootScope.user = response;
          //temp hack
          $rootScope.user.name = response.first_name;
          //
          console.log($rootScope.user);
        });

        //once user data is obtained, enter lobby
        $rootScope.Socket.emit('C_enterLobby', {
          id: $rootScope.user.id,
          name: $rootScope.user.name
        });
      });
    };

    //Socket lobby listeners
    $rootScope.Socket.on('S_updatePlayer', function(data){
      $rootScope.user = data.player;
    });
    $rootScope.Socket.on('S_updateRooms', function(data){
      $scope.$apply(function(){
        $scope.rooms = data.rooms;
      });
    });

    $scope.openRoom = function(roomName){
      $state.go('game.room');
      $rootScope.Socket.emit('C_openRoom', {
        playerId: $rootScope.user.id,
        roomName: roomName
      });
    };
    $scope.joinRoom = function(roomName){
      $state.go('game.room');
      $rootScope.Socket.emit('C_joinRoom', {
        roomName: roomName
      });
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
        id: $rootScope.user.id,
        name: $rootScope.user.name
      });
    }

  }]);
