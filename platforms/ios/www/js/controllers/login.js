'use strict'

app.controller('LoginCtrl', function($scope, $state, $ionicPopup, Auth,Loading){
  $scope.emailLogin = function(){
    console.log('buttun was clicked on login');

    $scope.user = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/partials/login.html',
      title: 'Signin',
      scope: $scope,
      buttons: [
        {
          text: '<b>Login</b>',
          type: 'button-energized',
          onTap: function(user) {
            Loading.show();
            user = $scope.user;
            console.log('the user is ', user);
            Auth.login(user).then(function(){
            Loading.hide();
            console.log('user was registered successfully');
            $state.go('tab.dash');
            }, function(err) {
              Loading.hide();
                  var errmessage = err;
                  if (errmessage == "Error: The specified email address is invalid.") {
                    errmessage = "メールアドレスが間違っています.";
                  } else if (errmessage == "Error: Firebase.authWithPassword failed: First argument must contain the key \"email\" with type \"string\"") {
                    errmessage = "メールアドレスを入力してください.";
                  } else if (errmessage == "Error: Firebase.authWithPassword failed: First argument must contain the key \"password\" with type \"string\"") {
                    errmessage = "パスワードを入力してください.";
                  } else if (errmessage == "Error: The specified password is incorrect.") {
                    errmessage = "パスワードが間違っています.";
                  };
                  var alertPopup = $ionicPopup.alert({
                      title: "ログインエラー",
                      template: errmessage,
                  });
              console.log('Error...', err);
            });
          }
        },
        {
          text: '<b>登録</b>',
          type: 'button-calm',
          onTap: function(user) {
            Loading.show();
            user = $scope.user;
            console.log('the user is ', user);
            Auth.register(user).then(function(){
            Loading.hide();
            console.log('user was registered successfully');
            $state.go('tab.dash');
            }, function(err) {
              Loading.hide();
                  var errmessage = err;
                  if (errmessage == "Error: The specified email address is already in use.") {
                    errmessage = "そのメールアドレスは既に使われています.";
                  } else if (errmessage == "Error: Firebase.createUser failed: First argument must contain the key \"email\" with type \"string\"") {
                    errmessage = "メールアドレスを入力してください.";
                  } else if (errmessage == "Error: Firebase.createUser failed: First argument must contain the key \"password\" with type \"string\"") {
                    errmessage = "パスワードを入力してください.";
                  }　else if (errmessage == "Error: The specified email address is invalid.") {
                    errmessage = "無効なメールアドレスです.";
                  };
                  var alertPopup = $ionicPopup.alert({
                      title: "登録エラー",
                      template: errmessage,
                  });
              console.log('Error...', err);
            });
            // $state.go('tab.dash')Error: The specified email address is invalid.

          }
        }
      ]
    });
  };

  // //砂時計を表示
  // $scope.show = function() {
  //   $ionicLoading.show({
  //   template: '<ion-spinner icon = "bubbles"></ion-spiner>'

  // });
  // };

  // //砂時計を非表示
  // $scope.hide = function() {
  //   $ionicLoading.hide();
  // };
});
