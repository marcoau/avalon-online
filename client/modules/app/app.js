angular.module('app', [
  'ui.router',
  'app.login',
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    $stateProvider
      .state('app', {
        url: '/',
        resolve: {
          redirect: ['$location', function($location){
            console.log('hihi');
            $location.path('/login');
          }]  
        },
      })
      // .state('app', {
      //   url: '/',
      //   views: {
      //     'folders': {
      //       templateUrl: '/modules/folders/folders.html',
      //       controller: 'FoldersCtrl'
      //       options
      //     },
      //     'notes': {
      //       templateUrl: '/modules/notes/notes.html',
      //       controller: 'NotesCtrl'
      //     }
      //   },
      // })
      .state('login', {
        url: '/login',
        templateUrl: '/modules/login/login.html',
        controller: 'LoginCtrl'
      });

     $urlRouterProvider.otherwise('/');
     $locationProvider.html5Mode(true);
  }]);
  