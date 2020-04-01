import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OlvidoPasswordPage } from './olvido-password';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: OlvidoPasswordPage }]),
    TranslateModule
  ],
  declarations: [
    
  ],
  entryComponents: [
    
  ],
  exports: []
})
export class OlvidoPasswordModule  { }
