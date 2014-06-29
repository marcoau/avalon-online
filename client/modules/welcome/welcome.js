angular.module('app.welcome',[])
  .controller('WelcomeCtrl', ['$rootScope', '$scope', '$state', '$window', function($rootScope, $scope, $state, $window){

    $window.FBsdkLoad(document, 'script', 'facebook-jssdk');

    //Initialize Facebook SDK
    $window.fbAsyncInit = function() {
      FB.init({
        appId      : '330011970489603',
        cookie     : true,  // enable cookies to allow the server to access 
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.0' // use version 2.0
      });
    };

    // 1. Logged into your app ('connected')
    // 2. Logged into Facebook, but not your app ('not_authorized')
    // 3. Not logged into Facebook and can't tell if they are logged into
    //    your app or not.
    var FBloginRedirect = function(response){
      if(response.status === 'connected'){
        $state.go('game');
      }
    };

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    $window.FBlogin = function(){
      console.log('$scope.FBlogin');
      FB.getLoginStatus(function(response) {
        console.log('get Login status:');
        console.log(response);
        FBloginRedirect(response);
      });
    };

    $scope.fakeLogin = function(id){
      $rootScope.user = {id: id};
      $state.go('game');
    };

  }]);
