'use strict'

app.factory('Followed', function(FURL, $firebaseArray){
	var ref = new Firebase(FURL);
	var Follow = {
		allFollowedsByUser : function(uid) {
			return $firebaseArray(ref.child('followeds').child(uid));
		},

		addFollowed: function(uid1,uid2) {
			return ref.child('followeds').child(uid1).child(uid2).set(true);
		},

		removeFollowed: function(uid1,uid2) {
			console.log(uid1);
			console.log(uid2);
			return ref.child('followeds').child(uid1).child(uid2).remove();
		}
	};

	return Follow;
});