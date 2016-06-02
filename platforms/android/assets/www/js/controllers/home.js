'use strict'

app.controller('HomeCtrl', function($scope, Auth, $state, uid, $cordovaScreenshot, SocialShare, Wannas, ImageUpload, FURL, $firebase, $firebaseArray,SharedStateService){
  $scope.friendImages ={'initUid':'initImg'};
  $scope.currentUid=uid;
  $scope.$watch(function(){
    return SharedStateService.friendImages;
  }, function(){
    $scope.friendImages = SharedStateService.friendImages;
  });
  	$scope.accountInformation = Auth.getProfile(uid);//めっちゃおもいので、UserNameだけ取得にしました。
	//$scope.accountName = Wannas.getUserName(uid);//UserNameだけ取得にしました。

  $scope.allWannasList = Wannas.all(uid);

  // $scope.$on('$ionicView.enter', function(e){
  //   // $scope.show();
  //   AdMobService.showBannerAd()
  //   // $scope.hide();
  // });

    var fb = new Firebase(FURL);
    var ref = $firebaseArray(fb.child("users").child(uid).child("images"));
    $scope.images = ref;
    $scope.uploadPic = function(file){
      return ImageUpload.uploadPic(file,ref);
    }

   $scope.screenShotShare = function(){
    $cordovaScreenshot.capture()
     .then(function(result) {
          //on success you get the image url
          //post on facebook (image & link can be null)

            SocialShare.shareViaTwitter("Text to post here...", result, "url")
                  .then(function(result) {
                        //do something on post success or ignore it...
                   }, function(err) {
                        console.log("there was an error sharing!");
                   });
     }, function(err) {
         console.log("there was an error taking a a screenshot!");
    });
  };


  $scope.goContentPage=function(wanna){
    console.log("goContent button was clicked");
    $state.go('tab.mywanna-content');
    SharedStateService.clickedWanna=wanna;
    $scope.clickedWanna=wanna;
  };

  $scope.removeWanna = function(index,ownerId,wannaId){
    $scope.allWannasList.splice(index, 1);
    Wannas.removeWanna(index, ownerId, wannaId);
  };

  $scope.twitterShare = function(){
    console.log("write button was clicked");
    $state.go('twitter-share');//state.goディレクトリ関係がわからない
  };

  $scope.facebookShare = function(){
    console.log("write button was clicked");
    $state.go('facebook-share');//state.goディレクトリ関係がわからない
  };

 	$scope.logout = function(){

   	Auth.logout();
 	}
})