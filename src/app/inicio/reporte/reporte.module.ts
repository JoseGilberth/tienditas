import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ReportePage } from './reporte';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ReportePage }]),
    TranslateModule
  ],
  declarations: [
    
  ],
  entryComponents: [ 
    
  ],
  exports: []
})
export class ReporteModule  { }
