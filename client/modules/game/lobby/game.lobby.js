angular.module('app.game.lobby', [])
  .controller('GameLobbyCtrl', ['$scope', '$state', '$location', function($scope, $state, $location){

    $scope.goToRoom = function(){
      $state.go('game.room');
    };

    $scope.quitGame = function(){
      $location.path('/');
      // $state.go('welcome');
    };

  }]);
