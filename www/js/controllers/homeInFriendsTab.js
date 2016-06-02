'use strict'

app.controller('HomeInFriendsTabCtrl', function($scope, Auth, $state, uid, $cordovaScreenshot, SocialShare, Wannas, ImageUpload, FURL, $firebase, $firebaseArray,SharedStateService){
  $scope.friendImages ={'initUid':'initImg'};
  $scope.currentUid=uid;
  $scope.$watch(function(){
    return SharedStateService.friendImages;
  }, function(){
    $scope.friendImages = SharedStateService.friendImages;
  });

  $scope.clickedFriendId=SharedStateService.clickedFriendId;//SharedStateService からクリックした友人のID を取得
  $scope.clickedFriendName=SharedStateService.clickedFriendName;//SharedStateService からクリックした友人のID を取得



  $scope.allWannasList = Wannas.all($scope.clickedFriendId);

  $scope.goContentPage=function(wanna){
    console.log("goContent button was clicked");
    $state.go('tab.wanna-content-2');
    SharedStateService.clickedWanna=wanna;
    $scope.clickedWanna=wanna;
  };


//  $scope.$on('$ionicView.enter', function(e){
//    // $scope.show();
//    AdMobService.showBannerAd()
//    // $scope.hide();
//  });

//    var fb = new Firebase(FURL);
//    var ref = $firebaseArray(fb.child("users").child(uid).child("images"));
//    $scope.images = ref;
//    $scope.uploadPic = function(file){
//      return ImageUpload.uploadPic(file,ref);
//    }


 	$scope.logout = function(){

   	Auth.logout();
 	}
})