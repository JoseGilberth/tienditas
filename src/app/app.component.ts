import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { configuraciones } from 'src/environments/configuraciones';
import { Configuraciones } from './_dto/out/configuraciones.model';
import { UtilComponent } from './_shared/util.component';

declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  rootPage: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
    , private translate: TranslateService
    , private nativeStorage: NativeStorage
    , private utilComponent: UtilComponent
    , private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(true);
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#AAFFFFFF');
      this.splashScreen.hide();

      let configuracionesIniciales = <Configuraciones>JSON.parse(localStorage.getItem(configuraciones.datos.configuracionesIniciales));
      if (configuracionesIniciales == null) {

        let config = new Configuraciones();
        config.establecimientosPorPeticion = 20;
        config.idioma = "es";

        localStorage.setItem(configuraciones.datos.configuracionesIniciales, JSON.stringify(config));
        localStorage.setItem(configuraciones.datos.favorito, null);
        localStorage.setItem(configuraciones.datos.access_token, ""); 

        this.translate.setDefaultLang(config.idioma);
        this.translate.use(config.idioma);

      } else {

        this.translate.setDefaultLang(configuracionesIniciales.idioma);
        this.translate.use(configuracionesIniciales.idioma);

      } 
      this.utilComponent.checarSesion(""); 
    });
  }



}
