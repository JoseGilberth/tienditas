import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuentaPage } from './cuenta.page';

import { TranslateModule } from '@ngx-translate/core';
import { ReportesPage } from './reportes/reportes';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: CuentaPage }]),
    TranslateModule
  ],
  declarations: [
    CuentaPage,
    ReportesPage
  ],
  entryComponents: [
    ReportesPage
  ]
})
export class CuentaPageModule { }
