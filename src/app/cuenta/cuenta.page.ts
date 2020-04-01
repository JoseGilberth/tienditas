import { Component } from '@angular/core';
import { UsuarioService } from '../_services/usuario.service';
import { LoadingService } from '../_shared/LoadingService';
import { Respuesta } from '../_dto/out/respuesta.model';
import { Usuario } from '../_model/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Configuraciones } from '../_dto/out/configuraciones.model';
import { configuraciones as config } from 'src/environments/configuraciones';
import { UtilComponent } from '../_shared/util.component';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../_services/login.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ReportesPage } from './reportes/reportes';
import { AdmobFreeService } from '../_services/admobfree.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: 'cuenta.page.html',
  styleUrls: ['cuenta.page.scss']
})
export class CuentaPage {

  public usuario: Usuario;
  public configuraciones: Configuraciones;

  constructor(private usuarioService: UsuarioService
    , private loginService: LoginService
    , private loading: LoadingService
    , private utilComponent: UtilComponent
    , private translate: TranslateService
    , public modalController: ModalController
    , private admobFreeService: AdmobFreeService
    , private router: Router) {

    this.usuario = new Usuario();
    this.configuraciones = new Configuraciones();
    this.configuraciones = <Configuraciones>JSON.parse(localStorage.getItem(config.datos.configuracionesIniciales));

  }

  // AL ENTRAR A LA VISTA
  ionViewDidEnter() {
    this.utilComponent.checarSesion("/cuenta");
  }

  ngOnInit() {
    this.obtenerUsuarioPorToken();
    this.admobFreeService.InterstitialAd();
  }

  actualizarUsuario() {
    this.translate.get('aplicacion.cuenta').subscribe((idioma: any) => {//-- INICIA TRADUCCION 
      this.loading.present(idioma.actualizando_usuario);

      this.usuarioService.actualizar(this.usuario).subscribe(
        (respuesta: Respuesta) => {
          this.usuario = <Usuario>respuesta.cuerpo;
          this.utilComponent.presentToast(idioma.datos_actualizados);
          this.loading.dismiss();
        },
        (error: HttpErrorResponse) => {
          this.loading.dismiss();
        }
      );
    });
  }

  guardarConfiguraciones() {
    this.translate.get('aplicacion.cuenta').subscribe((idioma: any) => {//-- INICIA TRADUCCION
      try {
        if (!Number.isNaN(this.configuraciones.establecimientosPorPeticion)) {
          localStorage.setItem(config.datos.configuracionesIniciales, JSON.stringify(this.configuraciones));
          this.translate.setDefaultLang(this.configuraciones.idioma);
          this.translate.use(this.configuraciones.idioma);
          this.utilComponent.presentToast(idioma.datos_guardados);
        } else {
          this.utilComponent.presentToast(idioma.datos_no_guardados);
        }
      } catch{
        this.utilComponent.presentToast(idioma.datos_no_guardados);
      }
    });
  }


  actualizar() {
    this.obtenerUsuarioPorToken();
  }

  async verMisReportes() {

    let self = this;
    const modal = await this.modalController.create({
      component: ReportesPage,
      cssClass: 'my-custom-modal-css',
      componentProps: { "data": null }
    });
    return await modal.present();
  }


  obtenerUsuarioPorToken() {

    this.translate.get('aplicacion.cuenta').subscribe((idioma: any) => {//-- INICIA TRADUCCION
      this.loading.present(idioma.recuperando_perfil);// INICIANDO SESIÓN  
      this.usuarioService.obtenerPorToken().subscribe(
        (respuesta: Respuesta) => {
          this.usuario = <Usuario>respuesta.cuerpo;
          this.usuario.password = "";
          this.usuario.repetirPassword = "";

          this.loading.dismiss();
        },
        (error: HttpErrorResponse) => {
          this.loading.dismiss();
        }
      );
    });

  }


  cerrarSesion() {
    this.translate.get('aplicacion.cuenta').subscribe((idioma: any) => {//-- INICIA TRADUCCION
      this.loading.present(idioma.cerrando_sesion);// INICIANDO SESIÓN  
      this.loginService.cerrarSesion().subscribe((respuesta: Respuesta) => {

        //this.router.navigateByUrl('login');
        this.router.navigate(["login"], {replaceUrl: true})// REMPLAZA LAS URLS DETRAS(IONIC 4) , NUEVO PARA ROOTPAGE
        localStorage.setItem(config.datos.access_token, "");
        localStorage.setItem(config.datos.configuracionesIniciales, null);
        localStorage.setItem(config.datos.favorito, null);
        this.loading.dismiss();

      }, (error: HttpErrorResponse) => {
        this.loading.dismiss();
      }
      );
    });
  }


}
