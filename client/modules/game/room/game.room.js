angular.module('app.game.room', [])
  .controller('GameRoomCtrl', ['$scope', '$state', function($scope, $state){
    
    $scope.goToLobby = function(){
      $state.go('game.lobby');
    };

  }]);