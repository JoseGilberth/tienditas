import { Injectable, OnInit } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { circle, Circle, icon, LatLng, latLng, Layer, LayerGroup, Map, marker, Marker } from 'leaflet';
import { configuraciones } from 'src/environments/configuraciones';
import { BuscarNegocioPorLatLngDTO } from '../_dto/out/buscarnegocioporlatlngdto.model';
import { Point } from '../_dto/out/point.model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UtilComponent implements OnInit {


  constructor(private alertController: AlertController
    , public toastController: ToastController
    , private diagnostic: Diagnostic
    , private openNativeSettings: OpenNativeSettings
    , private translate: TranslateService
    , private router: Router) {
  }

  ngOnInit() {
  }

  checarSesion(url: string) {
    try {
      let access_token = localStorage.getItem(configuraciones.datos.access_token);
      access_token.length.toString();
      if (access_token == "" || access_token.length <= 4 || access_token.length == null) {
        this.router.navigate(['login']);
      } else {
        this.router.navigateByUrl(url);
      }
    } catch{
      this.router.navigate(['login']);
    }
  }

  async showAlert(titulo: string, subtitulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: "bottom"
    });
    toast.present();
  }


  /**
   * 
   * GPS FUNCIONES
   * 
   */

  // VERIFICAR LOCALIZACION O GPS
  validarGps() {
    this.translate.get('aplicacion.gps').subscribe((idioma: any) => {//-- INICIA TRADUCCION 

      let self = this;
      this.diagnostic.isLocationEnabled()
        .then((isAvailable: boolean) => {
          if (!isAvailable) {
            self.openGPSSettings("Tienditas", "", idioma.validar_gps);
          }
        }
        ).catch((error) => {
          self.showAlert(idioma.errores.titulo, "", idioma.errores.valida_disponibilidad_gps);
        });
    });


  }

  //CHECA SI TIENE PROBLEMAS CON EL GPS AL RECUPERAR INFORMACION Y ESTA LANZA ERROR
  mostrarLabelErrorGPS() {
    this.translate.get('aplicacion.gps').subscribe((idioma: any) => {//-- INICIA TRADUCCION 
      this.presentToast(idioma.problemas_gps);
    });
  }



  // MUEVE LA CAMARA A LA POSICION SELECCIONADA
  mover(posicion: LatLng, mapa: Map) {
    mapa.flyTo(posicion, 15, {
      animate: true,
      duration: 1 // in seconds
    });
  }


  // CREAR UN MARCADOR
  crearMarcador(latLong: LatLng, movible: boolean, url: string): Marker {
    let marcador = marker(latLong, {
      draggable: movible,
      icon: icon({
        iconSize: [40, 50],
        iconUrl: url,
      })
    });
    return marcador;
  }

  actualizaArea(mapa: Map, dto: BuscarNegocioPorLatLngDTO) {
    mapa.eachLayer((layer: Layer) => {
      if (layer instanceof Circle) {
        let radio = parseInt(dto.distancia.toString(), 10);
        layer.setRadius(radio);
      }
    });
  }


  // SETEA EL MARCADOR EN EL MAPA
  actualizaMarcadorUsuario(marker: Marker, grupoMarcadoresUsuarios: LayerGroup, point: Point, radio, area: Circle, mapa: Map, latLng: LatLng, dto: BuscarNegocioPorLatLngDTO): Marker {
    this.removerLayerSiExiste(marker, mapa); // REMUEVO EL MARCADO ANTERIOR
    this.removerLayerSiExiste(area, mapa); // REMUEVO EL AREA ANTERIOR
    area = circle(latLng, radio, { color: "#00243C", opacity: 1, fillColor: "#00243C", fillOpacity: .5 }).addTo(mapa);
    marker = this.crearMarcador(latLng, true, configuraciones.icono_tu); // CREO UN MARCADOR

    grupoMarcadoresUsuarios.addLayer(marker);
    grupoMarcadoresUsuarios.addLayer(area);
    mapa.addLayer(grupoMarcadoresUsuarios);

    //mapa.addLayer(marker); // AÑADO EL MARCADOR AL AREA
    point.coordinates = [latLng.lng, latLng.lat];
    this.actualizaArea(mapa, dto);
    this.anhadirDragend(marker, grupoMarcadoresUsuarios, point, radio, area, mapa, dto); // LE AÑADO UN NUEVO DRAGEND AL MARCADOR
    this.mover(latLng, mapa); // MUEVO LA CAMARA A LA POSICION FINAL DEL MARCADOR
    return marker;
  }


  marcadorDefault(grupoMarcadoresUsuarios: LayerGroup, dto: BuscarNegocioPorLatLngDTO, marcador: Marker, mapa: Map, imagenMarcado: string) {

    if (grupoMarcadoresUsuarios.getLayers().length <= 1) {
      let radio = parseInt(dto.distancia.toString(), 10);
      let tu = null;
      let area = null;
      let latLong = latLng(dto.point.coordinates[1], dto.point.coordinates[0]);
      marcador = this.crearMarcador(latLong, false, imagenMarcado);
      let circulo = circle(latLong, radio, { color: "#00243C", opacity: 1, fillColor: "#00243C", fillOpacity: .5 });
      grupoMarcadoresUsuarios.addLayer(marcador);
      grupoMarcadoresUsuarios.addLayer(circulo);
      mapa.addLayer(grupoMarcadoresUsuarios);
      mapa.eachLayer((layer: Layer) => {
        if (layer instanceof Marker) {
          tu = layer;
        }
        if (layer instanceof Circle) {
          area = layer;
        }
      });
      this.anhadirDragend(tu, grupoMarcadoresUsuarios, dto.point, radio, area, mapa, dto);
      this.mover(latLong, mapa); // MUEVO LA CAMARA A LA POSICION FINAL DEL MARCADOR
    }
  }


  // REMUEVE UN LAYER SI YA EXISTE EN EL MAPA
  removerLayerSiExiste(layer: Layer, mapa: Map) {
    if (layer != null && layer !== undefined) {
      mapa.removeLayer(layer);
    }
  }

  // AÑADE LA PROPIEDAD DRAGEND A UN MARCADOR
  anhadirDragend(marker: Marker, grupoMarcadoresUsuarios: LayerGroup, point: Point, radio: number, area: Circle, mapa: Map, dto: BuscarNegocioPorLatLngDTO): Circle {
    let aqui = this;
    marker.dragging.enable();
    marker.on('dragend', function (e: any) {
      aqui.actualizaMarcadorUsuario(marker, grupoMarcadoresUsuarios, point, radio, area, mapa, e.target.getLatLng(), dto);
    });
    return area;
  }

  // REMUEVE LAYERS DE UN GRUPO
  removerLayerDeGrupo(layers: LayerGroup): LayerGroup {
    if (layers == null) {
      return;
    }
    layers.clearLayers();
  }



  async openGPSSettings(titulo: string, subtitulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      buttons: [
        {
          text: "Cancelar",
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'OK',
          handler: () => {
            this.openNativeSettings.open("location");
          }
        }
      ]
    });
    await alert.present();
  }



}