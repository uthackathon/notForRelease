//処理に時間がかかる時に追加
//前にshowLoading()を、後ろにhideLoading()をつける。
'use strict'

app.factory('Loading', function($ionicLoading) {
  var Loading = {
    show: function(){
      $ionicLoading.show({
        template: '<ion-spinner icon = "bubbles"></ion-spiner>'

      });
    },

    hide: function(){
      $ionicLoading.hide();
    }
    };

    return Loading;
});

