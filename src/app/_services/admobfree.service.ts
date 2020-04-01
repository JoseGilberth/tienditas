import { Injectable } from "@angular/core";
import {
  AdMobFree,
  AdMobFreeBannerConfig,
  AdMobFreeInterstitialConfig,
  AdMobFreeRewardVideoConfig
} from '@ionic-native/admob-free/ngx';
import { Platform } from '@ionic/angular';
import { UtilComponent } from '../_shared/util.component';
 
@Injectable({
    providedIn: 'root'
  })
export class AdmobFreeService {
 
  //Interstitial Ad's Configurations
  interstitialConfig: AdMobFreeInterstitialConfig = {
    isTesting: false,
    autoShow: false,
    id: "ca-app-pub-8246653838124289/3440305618"
  };
 
  //Reward Video Ad's Configurations
  RewardVideoConfig: AdMobFreeRewardVideoConfig = {
    isTesting: false, // Remove in production
    autoShow: false//,
    //id: "ca-app-pub-3940XXXXXXX42544/6300978111"
  };

  bannerConfig: AdMobFreeBannerConfig = {
    isTesting: false, // Remove in production
    autoShow: true,
    id: "ca-app-pub-8246653838124289/1416968771"
  };
 

  constructor( private admobFree: AdMobFree, public platform: Platform, private utilComponent: UtilComponent ) {
 
    platform.ready().then(() => {
      // Load ad configuration
      this.admobFree.interstitial.config(this.interstitialConfig);
      //Prepare Ad to Show
      this.admobFree.interstitial.prepare()
        .then(() => {
          // console.log(1);
        }).catch(e => console.log(e));

      // Load ad configuration
      this.admobFree.rewardVideo.config(this.RewardVideoConfig);
      //Prepare Ad to Show
      this.admobFree.rewardVideo.prepare()
        .then(() => {
          // console.log(2);
        }).catch(e => console.log(e));
    });
 
    //Handle interstitial's close event to Prepare Ad again
    this.admobFree.on('admob.interstitial.events.CLOSE').subscribe(() => {
      this.admobFree.interstitial.prepare()
        .then(() => {
          //console.log("Interstitial CLOSE");
        }).catch(e => console.log(e));
    });
    //Handle Reward's close event to Prepare Ad again
    this.admobFree.on('admob.rewardvideo.events.CLOSE').subscribe(() => {
      this.admobFree.rewardVideo.prepare()
        .then(() => {
          //console.log("Reward Video CLOSE");
        }).catch(e => console.log(e));
    });
  }
 
 
  BannerAd() {
    this.admobFree.banner.config(this.bannerConfig);
 
    this.admobFree.banner.prepare().then(() => {
      // success
    }).catch(e => console.log(e));
  }
 
  InterstitialAd() {
    //Check if Ad is loaded
    this.admobFree.interstitial.isReady().then(() => {
      //Will show prepared Ad
      this.admobFree.interstitial.show().then(() => {
      })
        .catch(e => console.log("show " + e));
    })
      .catch(e => console.log("isReady " + e));
  }
 
  RewardVideoAd() {
    //Check if Ad is loaded
    this.admobFree.rewardVideo.isReady().then(() => {
      //Will show prepared Ad
      this.admobFree.rewardVideo.show().then(() => {
      })
        .catch(e => console.log("show " + e));
    })
      .catch(e => console.log("isReady " + e));
  }
 
 
}