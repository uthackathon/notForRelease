//underscorejsを使用していることに注意のこと（http://underscorejs.org/）

'use strict'

app.controller('SearchFriendsCtrl', function(FURL,$firebaseAuth, $ionicLoading, $ionicModal,Follow, Followed, Match, Auth, uid, $scope,$ionicActionSheet,$ionicPopup,Message,$state,SharedStateService) {
  var ref = new Firebase(FURL);
  var currentUid = uid

  $scope.friendImages ={'initUid':'initImg'};

  $scope.$watch(function(){
    return SharedStateService.friendImages;
  }, function(){
    $scope.friendImages = SharedStateService.friendImages;
  });

  $scope.currentIndex = null;
  $scope.currentCardUid = null;
  $scope.profiles = [];

  $scope.currentRecommendedIndex = null;
  $scope.currentRecommendedCardUid = null;
  $scope.recommendedUsers = [];

  $scope.allFriendslist = [];

  $scope.$on('$ionicView.enter', function(e){
    // $scope.show();
    var allFriends=[];
    Match.allMatchesByUser(uid).$loaded().then(function(data) {
      for (var i = 0; i < data.length; i++) {
        var item = data[i];

        Auth.getProfile(item.$id).$loaded().then(function(profile) {
          allFriends.push(profile);
        });
      };
      $scope.allFriendslist =allFriends;
    });
    // $scope.hide();
  });


    $scope.goFriendHomePage=function(friendProfile){
        console.log("goFriendHome button was clicked");
        $state.go('tab.dash');
        SharedStateService.clickedFriendId=friendProfile.$id;
        SharedStateService.clickedFriendName=friendProfile.name;
        $state.go('tab.friend-home-2');
    };



  ref.child('matches').child(currentUid).on('child_added', function(dataSnapshot){
    var allFriends=[];
    Match.allMatchesByUser(uid).$loaded().then(function(data) {
      for (var i = 0; i < data.length; i++) {
        var item = data[i];

        Auth.getProfile(item.$id).$loaded().then(function(profile) {
          allFriends.push(profile);
        });
      }
      $scope.allFriendslist =allFriends;
    });
 
  });

	$scope.searchFriendsByName = function(index,friendNameToFind){
		//まずは検索窓の初期化
		$scope.cardRemove(index);

        Auth.getProfiles().$loaded().then(function(data){
          console.log("hey",_.pluck($scope.allFriendslist,'$id'));
            if (friendNameToFind == "") {
                        //検索窓が空欄の時は検索前に戻す(全部が当てはまるという検索の時間省略のため)
                            $scope.profiles = [];
                            console.log('reset');
                        }
            else {//検索部
                        $scope.serchprofiles = [];
                        console.log("searching...",friendNameToFind);
                        var serchword = new RegExp(friendNameToFind);
                        for (var i = 0; i < data.length; i++){
                            var item = data[i];
                            var test = String (item.name);
                            if ( test.match(serchword) && item.$id != currentUid && _.contains(_.pluck($scope.allFriendslist,'$id'),item.$id)!= true) {
                                //nameが部分一致かつ、自分自身ではない時
                                //かつすでに友達関係にない。
                                $scope.serchprofiles.push(item);
                            }
                        };

                        if ($scope.serchprofiles.length !== 0){//ヒットしたとき
                            $scope.profiles = $scope.serchprofiles
                            console.log('searched friends are',$scope.profiles);
                        //indexの変更
                        $scope.currentIndex = $scope.profiles.length - 1;
                        $scope.currentCardUid = $scope.profiles[$scope.currentIndex].$id;
                        }
                        else if ($scope.serchprofiles.length == 0){//何もヒットしなかったときは表示なし
                            $scope.profiles =　[]
                            console.log('friend is not finded');
                        };
            };
        });
    };
	// //以下のように書くことにより、ページ遷移した時に呼び出せるらしい(要調査)が、ページを更新するたびにリストに追加されてしまうのでやめた。
	//しかしながら、使用時に友達申請されたらどうなるかよく分からない。初めてログインした時から友達リストが変わらない????
	// $scope.$on('$ionicView.enter', function(e){

	//$loded().thenは読み込みに時間がかかる関数を呼び出す時に必須。thenの中のfunctionには呼び出し終わった関数のretunが入る。
	Followed.allFollowedsByUser(currentUid).$loaded().then(function(followedList) {
		for (var i = 0; i < followedList.length; i++){
		var id = followedList[i].$id;
		var user = Auth.getProfile(id);
		$scope.recommendedUsers.push(user);
			}
		});
	Follow.allFollowsByUser(currentUid).$loaded().then(function(followList) {
		//undescorejsを使用。ここでは上で一度求めたrecommendUsersのidとfollowlistのidを比較し、idが一致しているものを要素から取り除くというアルゴリズムをなんと２行で実現している。
		$scope.recommendedUsers = _.filter($scope.recommendedUsers, function(obj){
			return _.isEmpty(_.where(followList, {$id: obj.$id}));
		});
	});
	// });


  	$scope.follow = function(index, follow_uid) {
  		Follow.addFollow(currentUid, follow_uid);
  		Followed.addFollowed(follow_uid, currentUid);
  		Match.checkMatch(currentUid, follow_uid);
  		$scope.cardRemove(index);

  		console.log("FOLLOW")
  	},

  	$scope.followRecommended = function(index, follow_uid) {
  		Follow.addFollow(currentUid, follow_uid);
  		Followed.addFollowed(follow_uid, currentUid);
  		Match.checkMatch(currentUid, follow_uid);
  		$scope.recommendedCardRemove(index);

  		console.log("FOLLOW RECOMMENDED")
  	},

  	$scope.cardRemove = function(index) {
		$scope.profiles.splice(index, 1);

		if($scope.profiles.length > 0){
			//現在のindexの
			$scope.currentIndex = $scope.profiles.length - 1;
			$scope.currentCardUid = $scope.profiles[$scope.currentIndex].$id;
		}
 	}

 	$scope.recommendedCardRemove = function(index) {
		$scope.recommendedUsers.splice(index, 1);

		if($scope.recommendedUsers.length > 0){
			//現在のindexの
			$scope.currentRecommendedIndex = $scope.recommendedUsers.length - 1;
			$scope.currentRecommendedCardUid = $scope.profiles[$scope.currentRecommendedIndex].$id;
		}
 	}

    // ボタンが押された時、選択肢がPopupする
  $scope.showFunctionList = function(friend_uid) {
    console.log(friend_uid);
    
    $ionicActionSheet.show({
    titleText: 'Friends name',
    buttons: [
    { text: '<i class="icon ion-ios-email calm"></i> Send Message'},
    { text: '<i class="icon ion-clipboard calm"></i> Profile' }
    ],
    destructiveText: '<i class="icon ion-trash-a assertive"></i> Delete',
    cancelText: 'Cancel',
    cancel: function() {
    console.log('CANCELLED');
    },
    buttonClicked: function(index) {
        if (index == 0){
          Message.createNewRoom(uid,friend_uid);
          $state.go('tab.messages');

          console.log('SEND MESSAGE CLICKED', index);
        }

          return true;
        },

        destructiveButtonClicked: function() {
          console.log('DESTRUCT');
          $scope.showConfirm();
          return true;
        }
    });

    $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
    title: '友達の消去',
    template: 'Are you sure you want to delete this user?'
    });

    confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
    });
    };
  };

});
