import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Components } from '@ionic/core';
import { BuscarNegocioPorLatLngDTO } from '../../_dto/out/buscarnegocioporlatlngdto.model';
import { Point } from '../../_dto/out/point.model';
import { SolicitudCambio, TipoError } from 'src/app/_model/solicitudcambio.model';
import { Negocio } from 'src/app/_model/negocio.model';
import { LoadingService } from 'src/app/_shared/LoadingService';
import { TranslateService } from '@ngx-translate/core';
import { SolicitudCambioService } from 'src/app/_services/solicitudcambio.service';
import { UtilComponent } from 'src/app/_shared/util.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Respuesta } from 'src/app/_dto/out/respuesta.model';

@Component({
  selector: 'page-reporte',
  templateUrl: 'reporte.html',
  styleUrls: ['reporte.scss']
})
export class ReportePage implements OnInit {

  solicitudCambio: SolicitudCambio;
  tiposError: TipoError[] = [];

  constructor(private modalController: ModalController
    , private params: NavParams
    , private loading: LoadingService
    , private translate: TranslateService
    , private solicitudCambioService: SolicitudCambioService
    , private utilComponent: UtilComponent) {

    let negocio = <Negocio>params.get('data');

    this.solicitudCambio = new SolicitudCambio();
    this.solicitudCambio.establecimiento = negocio;
  }

  ngAfterViewChecked() {

  }



  ngOnInit() {
    this.crearErrores();
  }


  crearReporte() {

    this.translate.get('aplicacion.inicio').subscribe((idioma: any) => {//-- INICIA TRADUCCION 



      if ( this.solicitudCambio.comentario == (undefined || null || "" ) || ( this.solicitudCambio.comentario.length < 10 && this.solicitudCambio.comentario.length < 255 )) {
        this.utilComponent.showAlert(idioma.reporte, idioma.reporte_modulo.error_comentario, idioma.errores.titulo);
        return;
      }

      this.loading.present(idioma.reportando_negocio);// INICIANDO SESIÓN 
      this.solicitudCambioService.crear(this.solicitudCambio).subscribe((data: Respuesta) => {
        this.loading.dismiss();
        this.cerrar();
        this.utilComponent.showAlert(idioma.reporte, idioma.exito, idioma.reportado);
      }), (err: HttpErrorResponse) => {
        this.loading.dismiss();
      };
    });
  }

  crearErrores() {

    let tipoError = new TipoError();
    tipoError.id = 1;
    tipoError.etiqueta = "Tipo de actividad erronea";

    let tipoError2 = new TipoError();
    tipoError2.id = 2;
    tipoError2.etiqueta = "La tiendita ya no existe";

    let tipoError3 = new TipoError();
    tipoError3.id = 3;
    tipoError3.etiqueta = "La tiendita no esta en el lugar indicado";

    let tipoError4 = new TipoError();
    tipoError4.id = 4;
    tipoError4.etiqueta = "Otro";

    this.tiposError.push(tipoError);
    this.tiposError.push(tipoError2);
    this.tiposError.push(tipoError3);
    this.tiposError.push(tipoError4);

  }


  async cerrar() {
    await this.modalController.dismiss();
  }

}
