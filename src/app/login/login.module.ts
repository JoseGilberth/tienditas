import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './login.page';

import { TranslateModule } from '@ngx-translate/core';
import { OlvidoPasswordModule } from './olvido-password/olvido-password.module';
import { OlvidoPasswordPage } from './olvido-password/olvido-password';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: LoginPage }]),
    TranslateModule
  ],
  declarations: [
    LoginPage,
    OlvidoPasswordPage
  ],
  entryComponents: [
    OlvidoPasswordPage
  ]
})
export class LoginPageModule { }
