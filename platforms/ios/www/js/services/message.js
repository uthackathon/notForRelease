'use strict'

app.factory('Message', function(FURL, $firebaseArray, $firebaseObject, Auth, Wannas) {
  var ref = new Firebase(FURL);

  var Message = {

    createNewRoom: function(uid1,uid2){
      if(uid1 != uid2 ){
                  var rooms = $firebaseArray(ref.child('rooms'));
                  var newRoom={
                    users: [uid1,uid2]
                  };
                  
                  Auth.getUsersRooms(uid1).$loaded().then(function(data){
                    if(_.contains(_.pluck(data,'friendId'),uid2) ){//message room を複数作らないための処理。roomsの下のfriendIdのみを取り出してリスト化する。その上で、uid2が含まれているかどうかを調べる。
  
                      console.log('this room is already added');

                    }
                    else{
                      return rooms.$add(newRoom).then(function(){
                        var roomId = rooms[rooms.length - 1].$id//新しく追加したroomIdを取得
                        console.log('roomId is',roomId);
                        var user1 = $firebaseArray(ref.child('users').child(uid1).child('rooms'));
                        var user2 = $firebaseArray(ref.child('users').child(uid2).child('rooms'));
                        
                        var newRoom1 = {
                          roomId: roomId,
                          friendId: uid2, 
                          friendName: Wannas.getUserName(uid2)

                        };


                        return user1.$add(newRoom1).then(function(){
                          var newRoom2 = {
                          roomId: roomId,
                          friendId: uid1,
                          friendName: Wannas.getUserName(uid1)

                        };
                          return user2.$add(newRoom2);

                        });
                        
                        

                      });

                    };
                  });
                }
    },
    createNewRoomWithMessage: function(uid1,uid2,message){
      if(uid1 != uid2 ){
                  var rooms = $firebaseArray(ref.child('rooms'));
                  var newRoom={
                    users: [uid1,uid2]
                  };

                  Auth.getUsersRooms(uid1).$loaded().then(function(data){
                    if(_.contains(_.pluck(data,'friendId'),uid2) ){//message room を複数作らないための処理。roomsの下のfriendIdのみを取り出してリスト化する。その上で、uid2が含まれているかどうかを調べる。

                      console.log('this room is already added');

                    }
                    else{
                      return rooms.$add(newRoom).then(function(){
                        var roomId = rooms[rooms.length - 1].$id//新しく追加したroomIdを取得
                        console.log('roomId is',roomId);
                        var user1 = $firebaseArray(ref.child('users').child(uid1).child('rooms'));
                        var user2 = $firebaseArray(ref.child('users').child(uid2).child('rooms'));


                        return Wannas.getObjectUserName(uid2).$loaded().then(function(obj2){
                          var userName2=obj2.$value;
                            var newRoom1 = {
                              roomId: roomId,
                              friendId: uid2,
                              friendName: userName2

                            };

                            return user1.$add(newRoom1).then(function(){
                              return Wannas.getObjectUserName(uid1).$loaded().then(function(obj1){
                                var userName1=obj1.$value;
                                var newRoom2 = {
                                roomId: roomId,
                                friendId: uid1,
                                friendName: userName1
                                };
                                return user2.$add(newRoom2).then(function(){
                                  var newMessage={
                                      message: message,
                                      userId: uid1
                                      };
                                  return $firebaseArray(ref.child('rooms').child(roomId).child('messages')).$loaded().then(function(data){
                                    console.log("return currentRoom.$add(newMessage);");
                                    console.log(data);
                                    return data.$add(newMessage);
                                  });

                                });

                              });

                            });



                        });




                      });

                    };
                  });
                }
    },

    getAllRooms: function(currentUid){
      return $firebaseArray(ref.child('users').child(currentUid).child('rooms'));
    },

    sendMessage: function(message,currentUid,currentRoomId){
                  var currentRoom = $firebaseArray(ref.child('rooms').child(currentRoomId).child('messages'));
                  var newMessage={
                    message: message,
                    userId: currentUid
                  };

                  return currentRoom.$add(newMessage);
    },




    getAllMessages: function(currentRoomId){
      return $firebaseArray(ref.child('rooms').child(currentRoomId).child('messages'));
    }

  }
  return Message;

});