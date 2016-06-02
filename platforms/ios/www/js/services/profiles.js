'use strict'

app.factory('Profiles', function(FURL, $firebaseArray, Auth) {
  var ref = new Firebase(FURL);
  var profiles = $firebaseArray(ref.child('users'));

  var Profiles = {

    all: function(){
      return profiles;
    },
    saveProfile: function(profile, image){
      var newProfile = {
      name: profile.name,
        
    };
    
    }
  };
  return Profiles;
});