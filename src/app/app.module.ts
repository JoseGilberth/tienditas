// HTTP
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
// SEGURIDAD 
import { JwtModule } from '@auth0/angular-jwt';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

// LIBRERIAS
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
//INTERNACIONALIZACION
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// CONFIGURACIONES 
import { configuraciones } from 'src/environments/configuraciones';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// INTERCEPTRO JWT 
import { TokenInterceptor } from './_shared/token-interceptor';

import { AdMobFree } from '@ionic-native/admob-free/ngx'; 

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// OBTIENE EL TOKEN
export function tokenGetter() {

  let token = localStorage.getItem(configuraciones.datos.access_token);

  return token;
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [ 
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(), 
    
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['https://tienditas.com.mx'],
        blacklistedRoutes: ['']
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    NativeStorage,
    Geolocation,
    Diagnostic,
    OpenNativeSettings,
    AdMobFree
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
