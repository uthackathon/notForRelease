'use strict'

app.controller('MessagesCtrl', function($state, $scope, Message, uid, SharedStateServiceForMessage,SharedStateService){
  $scope.friendImages ={'initUid':'initImg'};

  $scope.$watch(function(){
    return SharedStateService.friendImages;
  }, function(){
    $scope.friendImages = SharedStateService.friendImages;
  });

	$scope.AllRooms = Message.getAllRooms(uid);
  $scope.friendName = function(uid){
    return Auth.getProfile(uid).name;
  };

  $scope.testButton = function(){
      Message.createNewRoom(uid,'1292743b-df60-4ccf-9d7d-5fb04a26cb66');
  };

	// $scope.$on('$ionicView.enter', function(e){
	// 	Message.createNewRoom(uid,uid);
	// });



  $scope.goMessageRoom=function(roomId){
                  console.log("goMessageDetailPage button was clicked");
                  $state.go('tab.message-room');
                  //timeline.jsを参考にした
                  SharedStateServiceForMessage.chosenRoomId= roomId;
                  $scope.chosenRoomId = roomId;
               };
});

 	// $scope.goContentPage=function(wanna){
  //                 console.log("goContent button was clicked");
  //                 $state.go('tab.wanna-content');
  //                 //ダッシュページと内容ページでWanna 情報をやりとりするためにSharedStateService に入れた値を共有する。
  //                 // http://whiskers.nukos.kitchen/2015/05/21/angularjs-controller-coordination.html のShared Service などを参考にした。
  //                 SharedStateService.clickedWanna=wanna;
  //                 $scope.clickedWanna=wanna;
  //                 console.log("timeline",wanna.content);
  //              };