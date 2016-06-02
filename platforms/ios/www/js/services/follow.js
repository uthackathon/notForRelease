'use strict'

app.factory('Follow', function(FURL, $firebaseArray){
	var ref = new Firebase(FURL);
	var Follow = {
		allFollowsByUser : function(uid) {
			return $firebaseArray(ref.child('follows').child(uid));
		},

		addFollow: function(uid1,uid2) {
			return ref.child('follows').child(uid1).child(uid2).set(true);
		},

		removeFollow: function(uid1,uid2) {
			console.log(uid1);
			console.log(uid2);
			return ref.child('follows').child(uid1).child(uid2).remove();

		}
	};

	return Follow;
});