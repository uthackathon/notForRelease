'use strict'

app.factory('ImageUpload', function(Upload, $timeout, FURL, $firebaseArray) {

    // ストアされたjson objectをmodelにバインド

    var ImageUpload = {

        uploadPic: function(file,ref) {//すでにある画像を全削除してからアップロード
          angular.forEach(ref, function(img, i){
            var row = ref.$getRecord(ref[i].$id);
            ref.$remove(row);
          });
          var images = Upload.base64DataUrl(file).then(function(base64Urls){
            $timeout(function () { file.result = base64Urls.data; });
            // 同期配列にArray.push
            ref.$add({images : base64Urls})
            .then(function(error) {
              if (error) { console.log("Error:",error);
              } else { console.log("Post set successfully!");
              }
            });
          });
        },

        // 画像全削除
        image_all_remove: function(ref){
          angular.forEach(ref, function(img, i){
            var row = ref.$getRecord(ref[i].$id);
            ref.$remove(row);
          });
        },
    };
    return ImageUpload;
})
