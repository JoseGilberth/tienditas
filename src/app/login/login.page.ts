import { Component, ViewChild, ElementRef } from '@angular/core';
import { Login } from '../_dto/out/login.model';
import { Registro } from '../_dto/out/registro.model';
import { LoginService } from '../_services/login.service';
import { Token } from '../_model/token.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { configuraciones } from 'src/environments/configuraciones';
import { UtilComponent } from '../_shared/util.component';
import { LoadingService } from '../_shared/LoadingService';
import { TranslateService } from '@ngx-translate/core';
import { RegistroService } from '../_services/registro.service';
import { Respuesta } from '../_dto/out/respuesta.model';
import { Usuario } from '../_model/usuario.model';
import { ModalController } from '@ionic/angular';
import { OlvidoPasswordPage } from './olvido-password/olvido-password';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage {

  public login: Login;
  public registro: Registro;
  loginForm: FormGroup;
  registroForm: FormGroup;

  @ViewChild('loginID') loginBtn: ElementRef;
  @ViewChild('signup') signupBtn: ElementRef;

  constructor(private loginService: LoginService
    , private nativeStorage: NativeStorage
    , private router: Router
    , private utilComponent: UtilComponent
    , private loading: LoadingService
    , private registroService: RegistroService
    , public modalController: ModalController
    , private translate: TranslateService
    , private fb: FormBuilder) {

    this.login = new Login();
    this.login.grant_type = "password";

    this.registro = new Registro();

    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registroForm = this.fb.group({
      correo: ['', Validators.required],
      usuario: ['', Validators.required],
      password: ['', Validators.required],
      repetirPassword: ['', Validators.required]
    });

  }

  // AL ENTRAR A LA VISTA
  ionViewDidEnter() {
    this.utilComponent.checarSesion("");
    let login = <Login>JSON.parse(localStorage.getItem(configuraciones.datos.login));
    if (login != null) {
      this.login = login;
    }
  }

  /* INICIAR SESIÓN */
  iniciarSesion() {
    this.translate.get('aplicacion.login').subscribe((idioma: any) => {//-- INICIA TRADUCCION
      this.loading.present(idioma.iniciando_sesion);// INICIANDO SESIÓN
      this.loginService.iniciarSesion(this.login).subscribe((token: Token) => {

        localStorage.setItem(configuraciones.datos.access_token, token.access_token);
        //this.router.navigateByUrl('');
        this.router.navigate([""], { replaceUrl: true })// REMPLAZA LAS URLS DETRAS(IONIC 4) , NUEVO PARA ROOTPAGE
        localStorage.setItem(configuraciones.datos.login, JSON.stringify(this.login));
        this.loading.dismiss();

      }, (error: HttpErrorResponse) => {
        this.loading.dismiss();
        if (error.error.mensaje != null) {
          this.utilComponent.showAlert(idioma.errores.error_iniciar_sesion, "", error.error.mensaje);
        } else {
          this.utilComponent.showAlert(idioma.errores.error_iniciar_sesion, "", error.error.error_description);
        }
      });
    });//-- TERMINA TRADUCCION
  }


  /* REGISTRARME */
  registrarme() {
    this.translate.get('aplicacion.login').subscribe((idioma: any) => {//-- INICIA TRADUCCION
      this.loading.present(idioma.registrando_usuario);// INICIANDO SESIÓN

      this.registroService.registrarse(this.registro).subscribe((respuesta: Respuesta) => {
        let usuario: Usuario = <Usuario>respuesta.cuerpo;
        this.utilComponent.showAlert("Tienditas", idioma.te_enviamos_un_correo, idioma.revisa_tu_bandeja);
        this.loading.dismiss();
      }, (error: HttpErrorResponse) => {
        this.loading.dismiss();
        this.utilComponent.showAlert(idioma.errores.error_registro, "", error.error.mensaje);
      });
    });//-- TERMINA TRADUCCION
  }

  async olvidoPassword() {
    const modal = await this.modalController.create({
      component: OlvidoPasswordPage,
      cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
  }


  /* 
   * 
   * FUNCIONALIDAD DE LA PAGINA 
   * 
   * */
  loginBtns(e) {
    let parent = e.target.parentNode.parentNode;
    e.target.parentNode.parentNode.classList.forEach(element => {
      if (element !== "slide-up") {
        parent.classList.add('slide-up');

        let parent2 = this.signupBtn.nativeElement.parentNode;
        this.signupBtn.nativeElement.parentNode.classList.forEach(element => {
          if (element !== "slide-up") {
            parent2.classList.add('slide-up')

          } else {
            this.loginBtn.nativeElement.parentNode.parentNode.classList.add('slide-up')
            parent2.classList.remove('slide-up')
          }
        });

      } else {
        this.signupBtn.nativeElement.parentNode.classList.add('slide-up')
        parent.classList.remove('slide-up');
      }
    });
  }

  signupBtns(e) {
    let parent = e.target.parentNode;
    e.target.parentNode.classList.forEach(element => {
      if (element !== "slide-up") {
        parent.classList.add('slide-up')

        let parent2 = this.loginBtn.nativeElement.parentNode.parentNode;
        this.loginBtn.nativeElement.parentNode.parentNode.classList.forEach(element => {
          if (element !== "slide-up") {
            parent2.classList.add('slide-up');
          } else {
            this.signupBtn.nativeElement.parentNode.classList.add('slide-up')
            parent2.classList.remove('slide-up');
          }
        });

      } else {
        this.loginBtn.nativeElement.parentNode.parentNode.classList.add('slide-up')
        parent.classList.remove('slide-up')
      }
    });
  }




}
