'use strict'

app.controller('DashCtrl', function(uid,usr,$scope,$state,Wannas,SharedStateService,Match,$timeout,FURL, $firebaseArray,Message) {
               //ログインする前に uid を参照しようとするとエラーとなるので注意。
               //エラー処理については http://uhyohyo.net/javascript/9_8.html
               //ログインする前にuid は使えないので、エラー処理を入れた。(結局、抜いた)
                              $scope.imageLog=0;
               var icon0="ion-android-bulb";
               var icon1="icon ion-ios-football";//アイコンの画像名をwanna につけて保存
               var icon2="icon ion-ios-wineglass";
               var icon3="icon ion-bag";
               var icon4="icon ion-map";
               var icon5="icon ion-music-note";

               var currentUid = uid;
               var allwanna=Wannas.all(currentUid);
               $scope.friendidList = [uid];
               var likedWannaList=[];
               var nameTest=usr;
               var roomList = [];
               var likePink='rgb(255, 192, 203)';
               var likeOff='#bbbbbb';
               $scope.friendImages ={'initUid':'initImg'};
               $scope.displayState=1;

               $scope.$watch(function(){
                     return SharedStateService.friendImages;
                   }, function(){
                     $scope.friendImages = SharedStateService.friendImages;
               });

               console.log('userName gained before html',nameTest,uid);
               var flag =0;

                var fb = new Firebase(FURL);

                $scope.testimage = $firebaseArray(fb.child("users").child(currentUid).child("images"));

                $scope.showSearchBox= function(){
                    var sB=document.getElementById('searchBox');
                    if(sB.style.display=='block'){
                        document.getElementById('searchBox').style.display="none";
                    }else{
                        document.getElementById('searchBox').style.display="block";
                    }
                };

                $scope.images = function(userid){
                  var ref = fb.child("users").child(userid).child("images");
                  var sync = $firebaseArray(ref);
                  return sync[0];
                  console.log(sync);
                };

                $scope.uicon = function(userid){
                  var localref = fb.child("users").child(userid).child("images");
                  return $firebaseArray(localref)[0].images;
                };

                $scope.date = function(dayInt){
                  var dayString = String(dayInt);
                  var month = dayString.substr(4,2);
                  var day = dayString.substr(6,2);
                  var hour = dayString.substr(8,2);
                  var min = dayString.substr(10,2);
                  var date = month+"/"+day+" "+hour+":"+min;
                  return date;
                }


//                $scope.getFriendsImage=function(fList,flag){
//                        Wannas.imageAll(fList[flag]).$loaded().then(function(images){
//                              console.log('images',images);
//                              console.log('flist[flag]',fList[flag]);
//                              console.log('flag',flag);
//                              if(images[0]==null){console.log('undefined');
//                              SharedStateService.friendImages[fList[flag]]='img/ben.png';
//                              }else{
//                              SharedStateService.friendImages[fList[flag]]=images[0]['images'];
//                              }
////                              console.log('image',fList[k],images);
//                              if(flag<fList.length-1){
//                                console.log('fList length',fList.length);
//                                flag+=1;
//                                $scope.getFriendsImage(fList,flag);
//                              }else{
//                              flag=0;
//                              }
//                        },function(error){
//                          console.log('oh no! no images file');
//                        });
//                };

                $scope.doReload=function(){
                    allwanna=Wannas.all(currentUid);
                    Match.allMatchesByUser(uid).$loaded().then(function(data) {
                    //$loadedを使わないとlengthが正常動作しない（違うとこのlengthを参照する）
                          for (var i = 0; i < data.length; i++) {
                              var item = data[i];
                              $scope.friendidList.push(item.$id);
                              Wannas.all(item.$id).$loaded().then(function(friendwanna) {
                                for (var j = 0; j < friendwanna.length; j++) {
                                  allwanna.push(friendwanna[j]);
                                }
                              });
                          }
                        console.log("allwanna is",allwanna);
                        console.log("friend ids are",$scope.friendidList);
                    $scope.$broadcast('scroll.refreshComplete');
                    });
//                    location.reload(false);
                };

                Match.allMatchesByUser(uid).$loaded().then(function(data) {
                //$loadedを使わないとlengthが正常動作しない（違うとこのlengthを参照する）
                      for (var i = 0; i < data.length; i++) {
                          var item = data[i];
                          $scope.friendidList.push(item.$id);
                          Wannas.all(item.$id).$loaded().then(function(friendwanna) {
                            for (var j = 0; j < friendwanna.length; j++) {
                              allwanna.push(friendwanna[j]);
                            }
                          });
                      }
                    console.log("allwanna is",allwanna);
                    console.log("friend ids are",$scope.friendidList);
                });

                $scope.changeState= function(num){
                    switch(num){
                    case 1:
                        $scope.displayState=1;
                        break;
                    case 2:
                        if($scope.displayState ==8){
                            $scope.displayState=9;
                            break;
                        }else if($scope.displayState ==7){
                            $scope.displayState=8;
                            break;
                        }else if($scope.displayState ==6){
                            $scope.displayState=7;
                            break;
                        }else if($scope.displayState ==5){
                            $scope.displayState=6;
                            break;
                        }else if($scope.displayState ==4){
                            $scope.displayState=5;
                            break;
                        }else{
                            $scope.displayState=4;
                            break;
                        }
                        break;
                    case 3:
                        if($scope.displayState !=2){
                            $scope.displayState=2;
                        }else{
                            $scope.displayState=3;
                        }
                        break;
                    case 4:
                        break;
                    }


                };

                $scope.wannas = function(displayState){
                          switch (displayState){
                          case 1://投稿時間順
                            console.log('displayState1');
                            allwanna.sort(function(a,b){//上の動作が終わった後にしたい
                              return b.upload_time - a.upload_time;
                            });
                            for(var i=0; i< allwanna.length; i++){
                                if(uid in allwanna[i].likes){
                                    allwanna[i].likeInitColor=likePink;
                                }else{
                                    allwanna[i].likeInitColor=likeOff;
                                };
                            };
                            return allwanna;
                            break;
                          case 2://モチベーション高い順
                            console.log('displayState2');
                            allwanna.sort(function(a,b){//上の動作が終わった後にしたい
                              return b.motivation - a.motivation;
                            });
//                            for(var i=0; i< allwanna.length; i++){
//                                if(uid in allwanna[i].likes){
//                                    allwanna[i].likeInitColor=likePink;
//                                }else{
//                                    allwanna[i].likeInitColor=likeOff;
//                                };
//                            };
                            return allwanna;
                            break;
                          case 3://モチベーション低い順
                            console.log('displayState3');
                            allwanna.sort(function(a,b){//上の動作が終わった後にしたい
                              return a.motivation - b.motivation;
                            });
//                            for(var i=0; i< allwanna.length; i++){
//                                if(uid in allwanna[i].likes){
//                                    allwanna[i].likeInitColor=likePink;
//                                }else{
//                                    allwanna[i].likeInitColor=likeOff;
//                                };
//                            };
                            return allwanna;
                            break;
                          case 4://サッカー
                            console.log('displayState4');
                            var partialwanna=[];
                            for(var i=0; i< allwanna.length; i++){
//                                if(uid in allwanna[i].likes){
//                                    allwanna[i].likeInitColor=likePink;
//                                }else{
//                                    allwanna[i].likeInitColor=likeOff;
//                                };
                                if(allwanna[i]['icon']['0']==icon1){
                                    partialwanna.push(allwanna[i]);
                                }
                            };
                            return partialwanna;
                            break;
                          case 5://icon 2つめ
                            console.log('displayState5');
                            var partialwanna=[];
                            for(var i=0; i< allwanna.length; i++){
                                if(allwanna[i]['icon']['0']==icon2){
                                    partialwanna.push(allwanna[i]);
                                }
                            };
                            return partialwanna;
                            break;
                          case 6://icon 3つめ
                            console.log('displayState6');
                            var partialwanna=[];
                            for(var i=0; i< allwanna.length; i++){
                                if(allwanna[i]['icon']['0']==icon3){
                                    partialwanna.push(allwanna[i]);
                                }
                            };
                            return partialwanna;
                            break;
                          case 7://icon 4つめ
                            console.log('displayState7');
                            var partialwanna=[];
                            for(var i=0; i< allwanna.length; i++){
                                if(allwanna[i]['icon']['0']==icon4){
                                    partialwanna.push(allwanna[i]);
                                }
                            };
                            return partialwanna;
                            break;
                          case 8://icon 5つめ
                            console.log('displayState8');
                            var partialwanna=[];
                            for(var i=0; i< allwanna.length; i++){
                                if(allwanna[i]['icon']['0']==icon5){
                                    partialwanna.push(allwanna[i]);
                                }
                            };
                            return partialwanna;
                            break;
                          case 9://icon 6つめ
                            console.log('displayState9');
                            var partialwanna=[];
                            for(var i=0; i< allwanna.length; i++){
                                if(allwanna[i]['icon']['0']==icon0){
                                    partialwanna.push(allwanna[i]);
                                }
                            };
                            return partialwanna;
                            break;
                        }

                      };

//               $scope.$watch("wannas",function(){
//                var likeValid=0;
//                console.log("scope.wannas is changed");
//               });
                Message.getAllRooms(uid).$loaded().then(function(data) {
                //$loadedを使わないとlengthが正常動作しない（違うとこのlengthを参照する）
                      for (var i = 0; i < data.length; i++) {
                          var item = data[i];
                          roomList.push(item);
                      }
                      console.log("roomList is",roomList);

                });


                Message.getAllRooms(uid).$loaded().then(function(data) {
                //$loadedを使わないとlengthが正常動作しない（違うとこのlengthを参照する）
                      for (var i = 0; i < data.length; i++) {
                          var item = data[i];
                          roomList.push(item);
                      }
                      console.log("roomList is",roomList);

                });

               $scope.writeWanna=function(){
               console.log("write button was clicked");
               $state.go('tab.submit');//state.goディレクトリ関係がわからない
               };

               $scope.goContentPage=function(wanna){
                  console.log("goContent button was clicked");
                  $state.go('tab.wanna-content');
                  //ダッシュページと内容ページでWanna 情報をやりとりするためにSharedStateService に入れた値を共有する。
                  // http://whiskers.nukos.kitchen/2015/05/21/angularjs-controller-coordination.html のShared Service などを参考にした。
                  SharedStateService.clickedWanna=wanna;
                  $scope.clickedWanna=wanna;
//                  console.log("timeline",wanna.content);
               };

               $scope.goFriendHomePage=function(wanna){
                  console.log("goFriendHome button was clicked");
                  SharedStateService.clickedFriendId=wanna.ownerId;
                  SharedStateService.clickedFriendName=wanna.user_name;
                  $state.go('tab.friend-home');
               };


//               $scope.$watch('friendidList',function(){
//                    console.log('friends ids changed',$scope.friendidList);
//                    flag=0;
//                    $scope.getFriendsImage($scope.friendidList,flag);
//               });

               $scope.$watch('wannas',function(){
                    console.log('wannas is changed');
               });

//               $scope.myFunction = function(wanna){
//
//                   $timeout(function(){
//                    likedWannaList=Wannas.findUsersLikes($scope.wannas(),currentUid);
//                    console.log("lile",likedWannaList);
//                    for(var i = 0; i < likedWannaList.length; i++){
//                        var pretarget = document.getElementById(likedWannaList[i]);
//                        //pretarget.style.backgroundColor='#FFFFFF'; ここはもとから透明にしているので変化がいらない
////                        pretarget.style.color='#0000CB';
//                    }
//                    likeValid=true;
//                    console.log("like valid phase");
//                                       flag=0;
//                                       $scope.getFriendsImage($scope.friendidList,flag);
//
//                   },10);
//               };
               $scope.referImage = function(friendUserId){
                   if(friendUserId in $scope.friendImages){
                        console.log('already gotten');
                   }else{
                        SharedStateService.friendImages[friendUserId]='img/loading.png';
                        Wannas.imageAll(friendUserId).$loaded().then(function(images){
                              console.log('got new image');
                              console.log('friendId',friendUserId);
                              if(images[0]==null){console.log('undefined');
                              SharedStateService.friendImages[friendUserId]='img/iw_gray.png';
                              }else{
                              SharedStateService.friendImages[friendUserId]=images[0]['images'];
                              }
//                              console.log('image',fList[k],images);
                        },function(error){
                          console.log('oh no! no images file');
                        });
                   }
               };
               $scope.referImage(uid);


               $scope.likeWanna=function(wanna){
                      console.log("like button was clicked");
                     // wanna.ownerId=currentUid;//test用の緊急処理。wanna 全てにownerId を書き込んでこの行を消すべし
                     //<ion-spinner icon="lines" class="spinner-calm"></ion-spinner>
                     if(1){//likeValid が1のときだけ、like ボタンが有効
                        var likeButton = document.getElementById(wanna.$id);
                        var buttonColor=likeButton.style.color;
                        console.log("button color",buttonColor);
                        if(buttonColor==likePink){//likeボタンがすでに色つきの時(like してるとき)
                            console.log("colorful");
                            Wannas.removeLikeFromWanna(wanna.ownerId,wanna.$id,currentUid,likeButton);
                            Wannas.removeLikeFromUser(wanna.ownerId,wanna.$id,currentUid,likeButton);
                        }else{//likeにまだ色がついてない時(like してないとき)
                            Wannas.addLikeToWanna(wanna.ownerId,wanna.$id,currentUid,likeButton);
                            Wannas.addLikeToUser(wanna.ownerId,wanna.$id,currentUid,likeButton);
                            //はい or いいえが欲しい
                            console.log(_.contains(_.pluck(roomList, 'friendId'),wanna.ownerId));
                            if(_.contains(_.pluck(roomList, 'friendId'),wanna.ownerId)){//すでに友達とのroomが存在するとき
                              var likedRoomId = roomList[_.indexOf(_.pluck(roomList, 'friendId'),wanna.ownerId)].roomId
                              var message = "Me Too!!! ; " + wanna.content ;
                              Message.sendMessage(message,uid,likedRoomId);
                            }
                            else{
                              console.log("create new messgage room")
                              var message = "Me Too!!! ; " + wanna.content ;
                              Message.createNewRoomWithMessage(uid,wanna.ownerId,message);
                              // var message = "Hi! I like your plan; " + wanna.content ;
                              // Message.sendMessage(message,uid,likedRoomId);
                            }
                        }
                      }else{
                        console.log("like button is not valid");
                      }

                      ;


               };

                //wannasの検索、とりあえずserchFriendsからコピー
                //検索窓からの取り込み=tipsToFind
                $scope.searchWannas = function(tipsToFind){
                    if (tipsToFind == "") {
                    //検索窓が空欄の時は検索前に戻す(全部が当てはまるという検索の時間省略のため)
                        $scope.wannas = function(){
                          return allwanna;
                        }
                        console.log('reset');
//                        var likeValid=false;
                    }
                    else {//検索部
                        $scope.serchwannas = [];
                        console.log("searching...",tipsToFind);
                        for (var i = 0; i < allwanna.length; i++){
                            var item = allwanna[i];
                            var serchword = new RegExp(tipsToFind);
                            if ( item.content.match(serchword) || item.description.match(serchword)) {
                                $scope.serchwannas.push(item);
                                //列に検索されたものを追加
                            }
                        }

                        if ($scope.serchwannas.length !== 0){//ヒットしたとき
                            $scope.wannas = function(){
                              return $scope.serchwannas;
                            }
                            console.log('searched wannas are',$scope.wannas);
                        }
                        else if ($scope.serchwannas.length == 0){//何もヒットしなかったときは表示なし
                            $scope.wannas =　function(){
                              return [];
                            }
                            console.log('wannas are not finded');
                        }
                    }
                };

})
