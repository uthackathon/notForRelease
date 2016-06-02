'use strict'

app.factory('Wannas', function(FURL,$firebaseObject, $firebaseArray) {

              var ref =new Firebase(FURL);
//              var wannas = $firebaseArray(ref.child('facebookuser').child('wannas'));//firebase構造によって変えてみてください。

              var Wannas ={

                all: function(currentUid){
                  var wannas = $firebaseArray(ref.child('users').child(currentUid).child('wannas'));//firebase構造によって変えてみてください。
                  return wannas;
                },

                getUserName: function(currentUid){
                //なまえの取得。もし名前変更に対応するならば add とかを使うかも。
                  //var name = "error";//wanna の名前が error のときは名前取得に失敗してる...
                  ref.child('users').child(currentUid).child('name').on("value", function(snapshot) {
                      name = snapshot.val();
                    //console.log(name);
                  }, function (err) {
                    console.log(err.code);
                  });//http://hacknote.jp/archives/9945/ を参考に。
                   return name;
                },

                imageAll: function(currentUid){
                  var images = $firebaseArray(ref.child('users').child(currentUid).child('images'));//firebase構造によって変えてみてください。
                  return images;
                },

                getObjectUserName: function(currentUid){
                  var obj =$firebaseObject(ref.child('users').child(currentUid).child('name'));
                  return obj;
                },



                  saveWanna: function(wanna,currentUid,userName,iconArray,time,motColor,motNum){
                  var wannas = $firebaseArray(ref.child('users').child(currentUid).child('wannas'));//firebase構造によって変えてみてください。
                  var newWanna={
                    ownerId: currentUid,
                    user_name: userName,//名前取得できるように
                    uid: currentUid,
                    content: wanna.content,
                    description: wanna.description,
                    icon: iconArray,//アイコン取得できるように
                    upload_time: time,
                    likes: {"initializeKey": "init"},
                    color: motColor,
                    motivation: motNum,
                  };
                  return wannas.$add(newWanna).then(function(){
                    console.log('added to the database');

                  })
                },


                removeWanna: function(index,wannaOwnerId,wannaId){
                  console.log("removeWanna");
                  ref.child('users').child(wannaOwnerId).child('wannas').child(wannaId).remove();
                },



                addLikeToWanna: function(wannaOwnerId,wannaId,currentUid,likeButton){
                  var onComplete = function(error){
                    if (error){
                        console.log('[FAILED] like to the wanna-database');
                        return 0;
                    } else {
                        console.log('like added to the wanna-database');
                        return 1;
                    }
                  };
                  ref.child('users').child(wannaOwnerId).child('wannas').child(wannaId).child("likes").child(currentUid).set(true,onComplete);
                },

                addLikeToUser: function(wannaOwnerId,wannaId,currentUid,likeButton){
                  var onComplete = function(error){//callback をtimeline.js に入れるのが上手くいかなかった(.then のpromise 設定が面倒)ので、ここに入れた
                                      if (error){
                                          console.log('[FAILED] like to the user-database');
                                          return 0;
                                      } else {
                                          console.log('like added to the user-database');
                                                likeButton.style.color='#FFC0CB';
                                          return 1;
                                      }
                                    };
                  var wannaPath= wannaOwnerId+"/"+wannaId;
                  ref.child('users').child(currentUid).child('likes').child(wannaPath).set(true,onComplete);
                },

                removeLikeFromWanna: function(wannaOwnerId,wannaId,currentUid,likeButton){
                  var onComplete = function(error){//callback をtimeline.js に入れるのが上手くいかなかった(.then のpromise 設定が面倒)ので、ここに入れた
                                      if (error){
                                          console.log('[FAILED] remove from the wanna-database');
                                          return 0;
                                      } else {
                                          console.log('like was removed from the wanna-database');
                                          return 1;
                                      }
                                    };
                  ref.child('users').child(wannaOwnerId).child('wannas').child(wannaId).child("likes").child(currentUid).remove(onComplete);
                },

                removeLikeFromUser: function(wannaOwnerId,wannaId,currentUid,likeButton){
                  var onComplete = function(error){//callback をtimeline.js に入れるのが上手くいかなかった(.then のpromise 設定が面倒)ので、ここに入れた
                                      if (error){
                                          console.log('[FAILED] remove from the user-database');
                                          return 0;
                                      } else {
                                          console.log('like was removed from the user-database');
                                                likeButton.style.color='#bbbbbb';
                                          return 1;
                                      }
                                    };
                  var wannaPath= wannaOwnerId+"/"+wannaId;
                  ref.child('users').child(currentUid).child('likes').child(wannaPath).remove(onComplete);
                },


                removeWannaLikeFromUser: function(wannaOwnerId,wannaId,user_uid){
                  var onComplete = function(error){//callback をtimeline.js に入れるのが上手くいかなかった(.then のpromise 設定が面倒)ので、ここに入れた
                                      if (error){
                                          console.log('[FAILED] remove from the user-database');
                                          return 0;
                                      } else {
                                          console.log('like was removed from the user-database',user_uid);
                                          return 1;
                                      }
                                    };
                  var wannaPath= wannaOwnerId+"/"+wannaId;
                  ref.child('users').child(user_uid).child('likes').child(wannaPath).remove(onComplete);
                },
                findUsersLikes:function(wannas,currentUid){
                 var likedWannaId=[];
                 for (var i = 0; i < wannas.length; i++){
                   var item = wannas[i];
                   if(currentUid in item.likes){
                    likedWannaId.push(item.$id);//その wanna のid を保管。
                   };
                 };
//                   $scope.wannas=data;//表示するやつをdata に同期
                   console.log("users likes",likedWannaId);
                   return likedWannaId;
                 },

                 getColor:function(mot){//0 から100 の数字でカラーを返す
//                   var colormap = require('colormap');
//                   options = {
//                     colormap: 'jet',   // pick a builtin colormap or add your own
//                     nshades: 100,       // how many divisions
//                     format: 'hex',     // "hex" or "rgb" or "rgbaString"
//                     alpha: 1      // set an alpha value or a linear alpha mapping [start, end]
//                   }
//                   var cg = colormap(options);
//                   console.log('cg',cg);
                   //calm =~ '#27c2f1'
                   console.log('typeof mot',typeof mot);
                   var colorArray=
                   [
                   "#00a0e9",
                   "#00a0c1",
                   "#00EEEE",
                   "#00FFEE",
                   "#0FC",
                   "#0F9",
                   "#0F6",
                   "#0F3",
                   "#0F0",
                   "#3F0",
                   "#6F0",
                   "#9F0",
                   "#CF0",
                   "#EF0",
                   "#FF0",
                   "#FE0",
                   "#FD0",
                   "#FC0",
                   "#FB0",
                   "#FA0",
                   "#F90",
                   "#F80",
                   "#F70",
                   "#F60"];
//                   if(num<210){
//                       var red=39;
//                       var green=32+num;
//                       var blue=241;
//                   }else if(num<412 && num>=210){
//                       var red=39;
//                       var green=242;
//                       var blue=241-(num-210);
//                   }else if(num<616 && num>=412){
//                       var red=39+num-412;
//                       var green=242;
//                       var blue=39;
//                   }else if(num<=700 && num>=616){
//                       var red=243;
//                       var green=242-(num-616);
//                       var blue=39;
//                   }
//                   console.log('rgb',red,green,blue);
//                   var colorMap='#'+red.toString(16)+green.toString(16)+blue.toString(16);
//                    var percentColors = [
//                        { pct: 0.0, color: { r: 0x40, g: 0xcc, b: 0xff } },
//                        { pct: 0.3, color: { r: 0x10, g: 0xdd, b: 0xaa } },
//                        { pct: 0.5, color: { r: 0x64, g: 0xee, b: 0x30 } },
//                        { pct: 0.57, color: { r: 0xbb, g: 0xee, b: 0x15 } },
//                        { pct: 0.65, color: { r: 0xff, g: 0xcc, b: 0x10 } },
//                        { pct: 1.0, color: { r: 0xff, g: 0x66, b: 0x20 } }];//案1 なめらかな色相
//                    var percentColors = [
//                        { pct: 0.0, color: { r: 0x40, g: 0xcc, b: 0xff } },
//                        { pct: 0.35, color: { r: 0x10, g: 0xdd, b: 0xaa } },
//                        { pct: 0.55, color: { r: 0x64, g: 0xee, b: 0x30 } },
//                        { pct: 0.60, color: { r: 0xbb, g: 0xee, b: 0x15 } },
//                        { pct: 0.63, color: { r: 0xee, g: 0xcc, b: 0x10 } },
//                        { pct: 0.68, color: { r: 0xee, g: 0xdd, b: 0x20 } },
//                        { pct: 0.75, color: { r: 0xff, g: 0xa3, b: 0x10 } },
//                        { pct: 1.0, color: { r: 0xff, g: 0x66, b: 0x20 } }];//案2 パステル色相
                    var percentColors = [
                        { pct: 0.0, color: { r: 0xaa, g: 0xee, b: 0xff } },
                        { pct: 0.3, color: { r: 0x90, g: 0xdc, b: 0xff } },
                        { pct: 0.4, color: { r: 0x75, g: 0xdd, b: 0xcc } },
                        { pct: 0.45, color: { r: 0x80, g: 0xee, b: 0x80 } },
                        { pct: 0.50, color: { r: 0xbb, g: 0xee, b: 0x40 } },
                        { pct: 0.60, color: { r: 0xee, g: 0xbb, b: 0x20 } },
                        { pct: 1.0, color: { r: 0xff, g: 0x66, b: 0x10 } }];//案3 濃淡ぷらす色相 blue多め
//                    var percentColors = [
//                        { pct: 0.0, color: { r: 0x55, g: 0x55, b: 0xff } },
//                        { pct: 0.125, color: { r: 0x55, g: 0xaa, b: 0xff } },
//                        { pct: 0.25, color: { r: 0x72, g: 0xe2, b: 0xe2 } },//
//                        { pct: 0.375, color: { r: 0x55, g: 0xff, b: 0xaa } },
//                        { pct: 0.5, color: { r: 0x55, g: 0xff, b: 0x55 } },
//                        { pct: 0.625, color: { r: 0xaa, g: 0xff, b: 0x55 } },
//                        { pct: 0.75, color: { r: 0xe2, g: 0xe2, b: 0x72 } },//
//                        { pct: 0.875, color: { r: 0xff, g: 0xaa, b: 0x55 } },
//                        { pct: 1.0, color: { r: 0xff, g: 0x55, b: 0x55 } }];/レインボー普通
//                    var percentColors = [
//                        { pct: 0.0, color: { r: 0xbb, g: 0xee, b: 0xff } },
//                        { pct: 0.2, color: { r: 0x99, g: 0xee, b: 0xcc } },
//                        { pct: 0.4, color: { r: 0x99, g: 0xee, b: 0x70 } },
//                        { pct: 0.50, color: { r: 0xbb, g: 0xee, b: 0x15 } },
//                        { pct: 0.60, color: { r: 0xee, g: 0xbb, b: 0x20 } },
//                        { pct: 1.0, color: { r: 0xff, g: 0x66, b: 0x10 } }];//案4 濃淡ぷらす色相
//                    var percentColors = [
//                        { pct: 0.0, color: { r: 0x40, g: 0x99, b: 0xff } },
//                        { pct: 0.33, color: { r: 0x11, g: 0xc2, b: 0xf1 } },
//                        { pct: 0.48, color: { r: 0x15, g: 0xcc, b: 0xdc } },
//                        { pct: 0.49, color: { r: 0x10, g: 0xdd, b: 0xaa } },
//                        { pct: 0.5, color: { r: 0x64, g: 0xee, b: 0x30 } },
//                        { pct: 0.51, color: { r: 0xbb, g: 0xee, b: 0x15 } },
//                        { pct: 0.55, color: { r: 0xff, g: 0xcc, b: 0x10 } },
//                        { pct: 1.0, color: { r: 0xff, g: 0x66, b: 0x20 } }];//案5 blue and orange
//                    var percentColors = [
//                        { pct: 0.0, color: { r: 0xdd, g: 0xdd, b: 0xdd } },
//                        { pct: 1.0, color: { r: 0x19, g: 0x88, b: 0xff } }];//案6 blue 濃淡
//                    var percentColors = [
//                        { pct: 0.0, color: { r: 0xdd, g: 0xdd, b: 0xdd } },
//                        { pct: 1.0, color: { r: 0xff, g: 0x66, b: 0x20 } }];//案7 orange 濃淡

                    var getColorForPercentage = function(pct) {
                        for (var i = 1; i < percentColors.length - 1; i++) {
                            if (pct < percentColors[i].pct) {
                                break;
                            }
                        }
                        var lower = percentColors[i - 1];
                        var upper = percentColors[i];
                        var range = upper.pct - lower.pct;
                        var rangePct = (pct - lower.pct) / range;
                        var pctLower = 1 - rangePct;
                        var pctUpper = rangePct;
                        var color = {
                            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
                        };
                        return '#' + color.r.toString(16)+ color.g.toString(16)+ color.b.toString(16);
                        // or output as hex if preferred
                    }

                   var num=Math.round(Number(mot)*colorArray.length/100.);
                   var pColor=getColorForPercentage(Number(mot)/100.);
                   console.log('percentage color',getColorForPercentage(Number(mot)/100.),mot);
                   var colorMap=colorArray[num];
                   console.log('colorMap',colorMap);
                   return pColor;
                 },



              };
              return Wannas;
})
