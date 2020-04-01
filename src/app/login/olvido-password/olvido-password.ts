import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Components } from '@ionic/core';
import { BuscarNegocioPorLatLngDTO } from '../../_dto/out/buscarnegocioporlatlngdto.model';
import { Point } from '../../_dto/out/point.model';
import { RecuperarPasswordService } from 'src/app/_services/recuperar_password.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/_shared/LoadingService';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilComponent } from 'src/app/_shared/util.component';
import { UsuarioPublicoCambiarClaveDTO } from 'src/app/_dto/out/UsuarioPublicoCambiarClaveDTO.model';
import { Respuesta } from 'src/app/_dto/out/respuesta.model';

@Component({
  selector: 'page-olvido-password',
  templateUrl: 'olvido-password.html',
  styleUrls: ['olvido-password.scss']
})
export class OlvidoPasswordPage implements OnInit {

  @ViewChild('correo') correo;
  @Input() modal: Components.IonModal;

  usuarioPublicoCambiarClaveDTO: UsuarioPublicoCambiarClaveDTO;

  constructor(private modalController: ModalController
    , private recuperarPasswordService: RecuperarPasswordService
    , private translate: TranslateService
    , private loading: LoadingService
    , private utilComponent: UtilComponent
    , private params: NavParams) {

    this.usuarioPublicoCambiarClaveDTO = new UsuarioPublicoCambiarClaveDTO();

  }

  ngAfterViewChecked() {
    setTimeout(() => {
      this.correo.setFocus();
    }, 150);
  }

  ngOnInit() {

  }

  recuperarPassword() {
    this.translate.get('aplicacion.login').subscribe((idioma: any) => {//-- INICIA TRADUCCION
      this.loading.present(idioma.recuperar_cuenta.enviando_correo);// INICIANDO SESIÓN
      this.recuperarPasswordService.recuperarPassword(this.usuarioPublicoCambiarClaveDTO).subscribe((respuesta: Respuesta) => {
        this.utilComponent.presentToast(idioma.recuperar_cuenta.enviado);
        this.loading.dismiss();
      }, (error: HttpErrorResponse) => {
        this.loading.dismiss();
        this.utilComponent.showAlert(idioma.errores.error_recuperar_cuenta, "", error.error.mensaje);
      });
    });//-- TERMINA TRADUCCION
  }

  async buscarNegocios() {
    await this.modalController.dismiss();
  }

  async cerrar() {
    await this.modalController.dismiss();
  }

}
