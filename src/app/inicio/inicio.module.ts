import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core'; 
import { InicioPage } from './inicio.page'; 
import { BusquedaManualPage } from './busqueda-manual/busqueda-manual';
import { ReportePage } from './reporte/reporte';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: InicioPage }]),
    TranslateModule
  ],
  declarations: [
    InicioPage,
    BusquedaManualPage,
    ReportePage
  ],
  entryComponents: [
    BusquedaManualPage,
    ReportePage
  ],
  exports: []
})
export class InicioPageModule { }
