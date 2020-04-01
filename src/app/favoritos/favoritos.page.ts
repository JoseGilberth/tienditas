import { Component } from '@angular/core';
import { Favoritos } from '../_model/favoritos';
import { FavoritosService } from '../_services/favoritos.service';
import { Respuesta } from '../_dto/out/respuesta.model';
import { Pageable } from '../_model/pageable.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { configuraciones } from 'src/environments/configuraciones';
import { AlertController } from '@ionic/angular';
import { AdmobFreeService } from '../_services/admobfree.service';
import { UtilComponent } from '../_shared/util.component';

@Component({
  selector: 'app-favoritos',
  templateUrl: 'favoritos.page.html',
  styleUrls: ['favoritos.page.scss']
})
export class FavoritosPage {

  hasFavourites: boolean = false;
  loading: boolean = true;
  public favoritos: Favoritos[];

  constructor(private favoritosService: FavoritosService
    , private translate: TranslateService
    , private alertController: AlertController
    ,private admobFreeService: AdmobFreeService
    , private utilComponent: UtilComponent
    , private router: Router) {

  }


  // AL ENTRAR A LA VISTA
  ionViewDidEnter() {
    this.utilComponent.checarSesion("/favoritos");
  }

  ngOnInit() {
    this.listarFavoritosService();
    this.admobFreeService.InterstitialAd();
  }

  actualizar() {
    this.listarFavoritosService();
  }

  verFavorito(favorito: Favoritos) {
    localStorage.setItem(configuraciones.datos.favorito, JSON.stringify(favorito));
    this.router.navigateByUrl('');
  }

  async quitarFavorito(favorito: Favoritos) {

    const alerta = await this.alertController.create({
      header: this.translate.instant("aplicacion.favoritos.eliminar_favorito"),
      message: this.translate.instant("aplicacion.favoritos.eliminar_favorito_mensaje"),
      
      buttons: [
        {
          text: this.translate.instant("aplicacion.favoritos.cancelar"),
          role: 'cancel',
          handler: () => { 
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.favoritosService.eliminar(favorito.id).subscribe((respuesta: Respuesta) => {
              this.listarFavoritosService();
            }, (error: HttpErrorResponse) => {

            });
          }
        }
      ]
    });
    await alerta.present();
  }



  listarFavoritosService() {
    this.loading = true;
    this.favoritosService.listaFavoritos().subscribe(
      (respuesta: Respuesta) => {
        let pageable: Pageable = <Pageable>respuesta.cuerpo;
        this.favoritos = <Favoritos[]>pageable.content;
        this.loading = false;
        if (this.favoritos.length > 0) {
          this.hasFavourites = true;
        }
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
      }
    );
  }



}
