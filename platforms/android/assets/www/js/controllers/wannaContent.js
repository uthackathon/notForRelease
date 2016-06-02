'use strict'

app.controller('WannaContentCtrl', function(uid,$scope,$state,SharedStateService,Wannas) {
               console.log('entered content page');
               //タイムラインでクリックしたwanna 情報の読み取り(Shared Service 経由で)
               $scope.clickedWanna=SharedStateService.clickedWanna;
               var likedUsersId=$scope.clickedWanna.likes;
               var idArray=[];
               for(var key in likedUsersId){
                   idArray.push(key);
               };
               $scope.likedUsers=[];

               console.log("ContentPage",$scope.clickedWanna.content);
               $scope.friendImages ={'initUid':'initImg'};
               var currentUid=uid;
               $scope.$watch(function(){
                     return SharedStateService.friendImages;
                   }, function(){
                     $scope.friendImages = SharedStateService.friendImages;
               });
               $scope.likeNum=Object.keys($scope.clickedWanna.likes).length -1 ;//イニシャライズの分を1つ引く
               console.log("the number of likes",$scope.likeNum);

               $scope.$watch('clickedWanna',function(){
                if(currentUid in $scope.clickedWanna.likes){
                    var likeButton = document.getElementById('likeInContent');
                    likeButton.style.backgroundColor='#FFFFFF';
                    likeButton.style.color='#FFC0CB';
                }
               });

               $scope.extract=function(idArray){
                    if(idArray.length>1){
                    var oneID=idArray[0];//ひとつ目のライクした人のid を取得
                    Wannas.getObjectUserName(oneID).$loaded().then(function(obj){
                      var name = obj.$value;
                      console.log('name',name);
                      if(name){
                         console.log('Writing');
                         $scope.likedUsers.push({'name': name,
                         'id': oneID});
                         idArray.shift();//ひとつめを削除
                         console.log('idArray',idArray);
                         $scope.extract(idArray);//減ったidArrayでまた始める
                      }
                    });
                    }else{
                        console.log('end of like users');
                    }
               };

               $scope.showLikedUsers=function(){
                 $scope.extract(idArray);
                 console.log('show liked users');
//                 var likeBoard=document.getElementById('likeBoard');
//                 likeBoard.style.visibility="visible";
               }




               $scope.date = function(dayInt){
                  var dayString = String(dayInt);
                  var month = Number(dayString.substr(4,2));
                  var day = Number(dayString.substr(6,2));
                  var hour = Number(dayString.substr(8,2));
                  var min = Number(dayString.substr(10,2));
                  var date = month+"月"+day+"日 "+hour+"時"+min+"分";
                  return date;
                }

                $scope.likeWannaInContent=function(wanna){
                    console.log("like button was clicked");
                    var likeButton = document.getElementById('likeInContent');
                    var buttonColor=likeButton.style.color;
                    console.log("button color",buttonColor);
                    if(buttonColor=='rgb(255, 192, 203)'){//likeボタンがすでに色つきの時(like してるとき)
                        console.log("colorful");
                        Wannas.removeLikeFromWanna(wanna.ownerId,wanna.$id,currentUid,likeButton);
                        Wannas.removeLikeFromUser(wanna.ownerId,wanna.$id,currentUid,likeButton);
                    }else{//likeにまだ色がついてない時(like してないとき)
                        Wannas.addLikeToWanna(wanna.ownerId,wanna.$id,currentUid,likeButton);
                        Wannas.addLikeToUser(wanna.ownerId,wanna.$id,currentUid,likeButton);
                    }

               };


})
