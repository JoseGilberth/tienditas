import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Components } from '@ionic/core';
import { BuscarNegocioPorLatLngDTO } from '../../_dto/out/buscarnegocioporlatlngdto.model';
import { Point } from '../../_dto/out/point.model';

@Component({
  selector: 'page-busqueda-manual',
  templateUrl: 'busqueda-manual.html',
  styleUrls: ['busqueda-manual.scss']
})
export class BusquedaManualPage implements OnInit {

  buscarNegocioPorLatLngDTO: BuscarNegocioPorLatLngDTO;
  point: Point;

  @ViewChild('buscar') buscar;
  @Input() modal: Components.IonModal;


  constructor(private modalController: ModalController
    , private params: NavParams) {
    this.buscarNegocioPorLatLngDTO = <BuscarNegocioPorLatLngDTO>params.get('data');
  }

  ngAfterViewChecked() {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.buscar.setFocus();
    }, 150);
  }

  ngOnViewInit(){
  }

  ngOnInit() {
  }

  async buscarNegocios() {
    await this.modalController.dismiss(this.buscarNegocioPorLatLngDTO);
  }

  async cerrar() {
    await this.modalController.dismiss();
  }

}
