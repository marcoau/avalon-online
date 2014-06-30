angular.module('app.game', ['app.game.header', 'app.game.lobby', 'app.game.room'])
  .controller('GameCtrl', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state){

    $rootScope.Socket = io.connect('/');
    $state.go('game.lobby');

    //should be scope!
    $scope.gameStatus = {
      leader: false,
      voting: false,
      mission: false
    };
    $scope.gameTemp = {
      teamSize: undefined,
      chosenTeam: undefined
    };

    //GAME LISTENERS
    $rootScope.Socket.on('S_updateRoom', function(data){
      $rootScope.$apply(function(){
        //hack: should be $scope.room
        $rootScope.room = data.room;
      });
    });
    $rootScope.Socket.on('S_startGame', function(){
      console.log('S_startGame');
    });
    $rootScope.Socket.on('S_updateGame', function(data){
      $rootScope.$apply(function(){
        $rootScope.game = data.info;
        console.log($rootScope.game);
      });
    });
    $rootScope.Socket.on('S_beLeader', function(data){
      console.log('S_beLeader');
      $scope.$apply(function(){
        $scope.gameStatus.leader = true;
        $scope.gameTemp.chosenTeam = [];
        $scope.gameTemp.teamSize = data.teamSize;        
      });
    });

  }]);
  