'use strict'

app.controller('TwitterShareCtrl', function($scope,$state, Auth, uid, $cordovaScreenshot, SocialShare, Wannas){
  $scope.allWannasList = Wannas.all(uid);
  $scope.screenShotShareViaTwitter = function(){

    $cordovaScreenshot.capture()
    .then(function(result) {
          //on success you get the image url

          //post on facebook (image & link can be null)
          
            SocialShare.shareViaTwitter("This is my iWanna list! Download this app from below link and let me know what you are interested in!!", result, "Link to share")
                  .then(function(result) {
                        //do something on post success or ignore it...
                   }, function(err) {
                        console.log("there was an error sharing!");
                   });
     }, function(err) {
         console.log("there was an error taking a a screenshot!");
    });
  },
  $scope.backToHome  = function(){
    $state.go('tab.home');
  } 

})