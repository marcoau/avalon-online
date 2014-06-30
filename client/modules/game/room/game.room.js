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



    $scope.leaveRoom = function(roomName){
      $rootScope.Socket.emit('C_leaveRoom', {
        roomName: roomName
      });
      $state.go('game.lobby');
    };

    //LEADER ACTIONS
    $scope.chooseTeam = function(playerId){
      console.log('old');
      console.log($scope.gameTemp);
      // $scope.$apply(function(){
        $scope.gameTemp.chosenTeam.push(playerId);        
      // });
      console.log('new');
      console.log($scope.gameTemp);
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

  }]);
