angular.module('app.game', ['app.game.lobby', 'app.game.room'])
  .controller('GameCtrl', ['$scope', '$state', function($scope, $state){
    $state.go('game.lobby');
  }]);