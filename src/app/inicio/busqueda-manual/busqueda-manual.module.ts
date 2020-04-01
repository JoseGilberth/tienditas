import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BusquedaManualPage } from './busqueda-manual';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: BusquedaManualPage }]),
    TranslateModule
  ],
  declarations: [
    
  ],
  entryComponents: [
    
  ],
  exports: []
})
export class BusquedaManualModule  { }
