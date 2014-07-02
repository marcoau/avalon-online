angular.module('app.game.room', [])
  .controller('GameRoomCtrl', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state){

    $scope.leaveRoom = function(roomName){
      $rootScope.Socket.emit('C_leaveRoom', {
        roomName: roomName
      });
      $state.go('game.lobby');
    };

    //LEADER ACTIONS
    $scope.chooseTeam = function(playerId){
      $scope.gameTemp.chosenTeam.push(playerId);        
    };
    $scope.removeFromTeam = function(playerId){
      var playerPos = $scope.gameTemp.chosenTeam.indexOf(playerId);
      $scope.gameTemp.chosenTeam.splice(playerPos, 1);
    };
    $scope.submitTeam = function(){
      $rootScope.Socket.emit('C_submitTeam', {chosenTeam: $scope.gameTemp.chosenTeam});
      $scope.gameStatus.leader = false;

      delete $scope.gameTemp.teamSize;
      delete $scope.gameTemp.chosenTeam;
    };

    //VOTING ACTIONS
    $scope.voteApprove = function(){
      $scope.gameTemp.vote = true;
    };
    $scope.voteReject = function(){
      $scope.gameTemp.vote = false;
    };
    $scope.submitVote = function(){
      $rootScope.Socket.emit('C_submitVote', {vote: $scope.gameTemp.vote});
      $scope.gameStatus.voting = false;

      delete $scope.gameTemp.voteTeam;
      delete $scope.gameTemp.teamLeader;
      delete $scope.gameTemp.vote;
    };
    $scope.cancelVote = function(){
      $scope.gameTemp.vote = undefined;
    };

    //MISSION ACTIONS
    $scope.decideSuccess = function(){
      $scope.gameTemp.decision = true;
    };
    $scope.decideFail = function(){
      $scope.gameTemp.decision = false;
    };
    $scope.submitDecision = function(){
      $rootScope.Socket.emit('C_submitDecision', {decision: $scope.gameTemp.decision});
      $scope.gameStatus.mission = false;

      delete $scope.gameTemp.decision;
    };
    $scope.cancelDecision = function(){
      $scope.gameTemp.decision = undefined;
    };

    //ASSASSIN ACTION
    $scope.chooseKill = function(playerId){
      $scope.gameTemp.assassinTarget = playerId;
    };
    $scope.submitKill = function(){
      $rootScope.Socket.emit('C_submitKill', {target: $scope.gameTemp.assassinTarget});
      $scope.gameStatus.assassin = false;

      delete $scope.gameTemp.assassinTarget;
    };
    $scope.cancelKill = function(){
      $scope.gameTemp.assassinTarget = undefined;
    };

    //ENDGAME ACTION
    $scope.stayInRoom = function(){
      $rootScope.Socket.emit('C_stayInRoom');
      delete $rootScope.game;

      delete $scope.gameTemp.goodWins;

    };
    $scope.leaveRoom = function(){
      $rootScope.Socket.emit('C_leaveRoomAfterGame');
      delete $rootScope.game;
      delete $rootScope.user.room;
      $state.go('game.lobby');

      delete $scope.gameTemp.goodWins;
    };

  }]);
