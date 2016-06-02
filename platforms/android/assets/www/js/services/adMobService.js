'use strict'

app.factory('AdMobService', function($cordovaAdMob){
	var adMobId = {
		admob_banner_key: '',
		admob_interstitial_key: ''
	};

	var adMobPosition = {
		BOTTOM_CENTER: 8
	};

	var AdMobService = {
	showBannerAd: function(){
		
		try {
			
			console.log('Show Banner Ad');			
			
			$cordovaAdMob.createBannerView({
				adId: "ca-app-pub-3940256099942544/6300978111",//adMobId.admob_banner_key,
				position: adMobPosition.BOTTOM_CENTER,
				isTesting: true,
				autoShow: true
			});

		} catch (e) {
			alert(e);
		}		
	},
	
	showInterstitialAd: function(){	
		try {
			
			console.log('Show Interstitial Ad');			

			$cordovaAdMob.createInterstitialView({
				adId: adMobId.admob_interstitial_key,
				isTesting: true,
				autoShow: true
			});
			
		} catch (e) {
			alert(e);
		}		
	}

	};	

		return AdMobService;
	});