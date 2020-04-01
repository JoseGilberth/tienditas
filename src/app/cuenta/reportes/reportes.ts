import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'page-reportes',
  templateUrl: 'reportes.html',
  styleUrls: ['reportes.scss']
})
export class ReportesPage implements OnInit {


  constructor(private modalController: ModalController
    , private params: NavParams) {
  }



  ngOnInit() {
  }


  async cerrar() {
    await this.modalController.dismiss();
  }

}
