angular.module('app.game', ['app.game.header', 'app.game.lobby', 'app.game.room'])
  .controller('GameCtrl', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state){

    $rootScope.Socket = io.connect('/');
    $state.go('game.lobby');

  }]);
  