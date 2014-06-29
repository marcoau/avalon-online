angular.module('app', [
  'ngCookies',
  'ui.router',
  'app.welcome',
  'app.game',
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    $stateProvider
      .state('welcome', {
        url: '/',
        templateUrl: '/modules/welcome/welcome.html',
        controller: 'WelcomeCtrl'
      })
      .state('game', {
        templateUrl: '/modules/game/game.html',
        controller: 'GameCtrl',
      })
      .state('game.lobby', {
        views: {
          'header': {
            templateUrl: '/modules/game/header/game.header.html',
            controller: 'GameHeaderCtrl'
          },
          'body': {
            templateUrl: '/modules/game/lobby/game.lobby.html',
            controller: 'GameLobbyCtrl'
          }
        }
      })
      .state('game.room', {
        views: {
          'header': {
            templateUrl: '/modules/game/header/game.header.html',
            controller: 'GameHeaderCtrl'
          },
          'body': {
            templateUrl: '/modules/game/room/game.room.html',
            controller: 'GameRoomCtrl'
          }
        }
      });

     $urlRouterProvider.otherwise('/');
     $locationProvider.html5Mode(true);
  }])

  .controller('AppCtrl', ['$scope', '$state', function($scope, $state){

  }]);
