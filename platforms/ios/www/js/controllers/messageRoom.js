'use strict'

app.controller('MessageRoomCtrl', function(FURL,$scope,$state,Message,SharedStateServiceForMessage,uid,Wannas,$ionicLoading,SharedStateService){
	var ref = new Firebase(FURL);
	$scope.allMessages = [];
	$scope.friendImages ={'initUid':'initImg'};

	$scope.$watch(function(){
	  return SharedStateService.friendImages;
	}, function(){
	  $scope.friendImages = SharedStateService.friendImages;
	});
 	console.log('entered message room');

 	$scope.currentRoomId=SharedStateServiceForMessage.chosenRoomId;
 	console.log("ContentPage",$scope.chosenRoomId);

	$scope.getImage=function(messageUserId){
		if(messageUserId == uid){
			return "img/white.png";
		}else{
			return $scope.friendImages[messageUserId];
		}
	};

 	$scope.sendMessage = function(){
 		var user = Wannas.getUserName(uid);
 		console.log(Wannas.getUserName(uid));
 		
 		var message = user + " : " + $scope.data.message;
 		Message.sendMessage(message,uid,$scope.currentRoomId).then(function(){
	    $scope.data.message = "";//メッセージを消去
	  });
 	};

  $scope.$on('$ionicView.enter', function(e){
	console.log('ionicEnter Fired!!');
    $scope.show();
//    $scope.allMessages = [];
	var initMessages=[];
    Message.getAllMessages($scope.currentRoomId).$loaded().then(function(data) {
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
        initMessages.push(item);
			}
		});
    $scope.allMessages = initMessages;
    $scope.hide();
  });

 	//firebaseのデーター構造に変化があった時（つまりメッセージを送信した時）に更新
 	ref.child('rooms').child($scope.currentRoomId).child('messages').on('child_added', function(dataSnapshot){
		console.log('child added Fired!!');
 		$scope.show();
//	    $scope.allMessages = []　//初期化。メッセージ更新のたびに初期化はまずい。。。。要訂正
		var initMessages=[];
   		Message.getAllMessages($scope.currentRoomId).$loaded().then(function(data) {
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				initMessages.push(item);
			}
		});
	    $scope.allMessages = initMessages;　//初期化。メッセージ更新のたびに初期化はまずい。。。。要訂正
	    $scope.hide();
	});//これ、とくに問題なさそう。でも、これがionicView enter の前にメッセージの回数分だけfire されちゃうのはちょっと問題。


  $scope.isMe = function(userId){
    if(uid==userId){
　　　　return "self";            
    }
  };
              //砂時計を表示
  $scope.show = function() {
    $ionicLoading.show({
    template: '<ion-spinner icon = "bubbles"></ion-spiner>'

    });
  };

   //砂時計を非表示
  $scope.hide = function(){
    $ionicLoading.hide();
  };

})