angular.module('app.game.room', [])
  .controller('GameRoomCtrl', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state){

    //Socket room listeners

    //Doesn't work!
    // $rootScope.Socket.on('S_updateRoom', function(data){
    //   console.log('update room!!!');

    //   $scope.$apply(function(){
    //     //hack: should be $scope.room
    //     $scope.room = data.room;
    //     console.log($scope.room);
    //   });
    // });

    // $rootScope.Socket.on('S_startGame', function(){
    //   console.log('S_startGame');
    // });

    $scope.leaveRoom = function(roomName){
      $rootScope.Socket.emit('C_leaveRoom', {
        roomName: roomName
      });
      $state.go('game.lobby');
    };

  }]);
