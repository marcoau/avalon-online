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
      //leader
      teamSize: undefined,
      chosenTeam: undefined,
      //voting
      voteTeam: undefined,
      teamLeader: undefined,
      vote: undefined,
      //mission
      decision: undefined
    };

    $rootScope.Socket.on('S_updateRoom', function(data){
      $rootScope.$apply(function(){
        //hack: should be $scope.room
        $rootScope.room = data.room;
      });
    });

    //GAME LISTENERS
    $rootScope.Socket.on('S_startGame', function(){
      console.log('S_startGame');
    });
    $rootScope.Socket.on('S_updateGame', function(data){
      $rootScope.$apply(function(){
        $rootScope.game = data.info;
      });
    });
    $rootScope.Socket.on('S_beLeader', function(data){
      $scope.$apply(function(){
        $scope.gameStatus.leader = true;
        $scope.gameTemp.chosenTeam = [];
        $scope.gameTemp.teamSize = data.teamSize;
      });
    });
    $rootScope.Socket.on('S_voteTeam', function(data){
      $scope.$apply(function(){
        $scope.gameStatus.voting = true;
        $scope.gameTemp.voteTeam = data.team;
        $scope.gameTemp.teamLeader = $rootScope.game.players[data.leaderId];        
      });
    });
    $rootScope.Socket.on('S_joinMission', function(){
      $scope.$apply(function(){
        $scope.gameStatus.mission = true;
      });
    });

  }]);
  