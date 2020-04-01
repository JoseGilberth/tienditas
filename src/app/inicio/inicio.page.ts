import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import leaflet, { latLng, LayerGroup, Map, Marker } from 'leaflet';
import { configuraciones } from 'src/environments/configuraciones';
import { BuscarNegocioPorLatLngDTO } from '../_dto/out/buscarnegocioporlatlngdto.model';
import { Configuraciones } from '../_dto/out/configuraciones.model';
import { Point } from '../_dto/out/point.model';
import { Respuesta } from '../_dto/out/respuesta.model';
import { Favoritos } from '../_model/favoritos';
import { Negocio } from '../_model/negocio.model';
import { Pageable } from '../_model/pageable.model';
import { SolicitudCambio } from '../_model/solicitudcambio.model';
import { AdmobFreeService } from '../_services/admobfree.service';
import { FavoritosService } from '../_services/favoritos.service';
import { NegocioService } from '../_services/negocio.service';
import { SolicitudCambioService } from '../_services/solicitudcambio.service';
import { LoadingService } from '../_shared/LoadingService';
import { UtilComponent } from '../_shared/util.component';
import { BusquedaManualPage } from './busqueda-manual/busqueda-manual';
import { ReportePage } from './reporte/reporte';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss']
})
export class InicioPage {

  @ViewChild('establecimiento') establecimientoId: ElementRef;
  @ViewChild('map') mapContainer: ElementRef;
  map: Map;

  private grupoMarcadoresNegocio: LayerGroup;
  private grupoMarcadoresUsuarios: LayerGroup;
  private markerUsuario: Marker;

  private negocios: Negocio[];
  public buscarNegocioPorLatLngDTO: BuscarNegocioPorLatLngDTO;
  private solicitudCambio: SolicitudCambio;
  private point: Point;
  private contador = 0;
  private toogleUbicacion: Boolean = false;
  private watch: any = null;
  public iconGPS: string = "locate";
  private pagina: number = 0;

  constructor(
    private elementRef: ElementRef
    , private geolocation: Geolocation
    , public modalController: ModalController
    , private negocioService: NegocioService
    , private favoritosService: FavoritosService
    , private utilComponent: UtilComponent
    , private loading: LoadingService
    , private alertController: AlertController
    , private translate: TranslateService
    , private solicitudCambioService: SolicitudCambioService
    , private admobFreeService: AdmobFreeService
    , private router: Router) {

    this.grupoMarcadoresNegocio = new LayerGroup;
    this.grupoMarcadoresUsuarios = new LayerGroup;
    this.buscarNegocioPorLatLngDTO = new BuscarNegocioPorLatLngDTO();
    this.buscarNegocioPorLatLngDTO.distancia = 500;
    this.buscarNegocioPorLatLngDTO.busqueda = "";

    this.point = new Point;
    this.point.type = "point";
    this.point.coordinates = [configuraciones.longitud, configuraciones.latitud];
    this.buscarNegocioPorLatLngDTO.point = this.point;

    this.obtenerUbicacion(); // OBTENGO LA UBICACION 
  }

  ngOnInit() {
    this.admobFreeService.BannerAd();

  }

  // AL ENTRAR A LA VISTA
  ionViewDidEnter() {
    if (this.map == null) {
      this.loadmap();// CARGO EL MAPA
    }
    this.utilComponent.checarSesion("");
    this.mostrarFavorito();
  }


  // CARGA EL MAPA 
  loadmap() {
    this.map = leaflet.map("map", {
      center: [configuraciones.latitud, configuraciones.longitud],
      zoom: 12,
      zoomControl: false
    });
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
      maxZoom: 18
    }).addTo(this.map);


    //this.map.on("click", function (e) { 
    //  this.utilComponent.marcadorDefault(this.grupoMarcadoresUsuarios, this.buscarNegocioPorLatLngDTO, this.markerUsuario, this.map);
    //});
  }

  // OBTENER POSICION
  obtenerUbicacion() {

    this.utilComponent.validarGps(); // VALIDO QUE EL GPS ESTE ENCENDIDO 
    if (this.contador == 4) {
      this.utilComponent.mostrarLabelErrorGPS();
      this.utilComponent.marcadorDefault(this.grupoMarcadoresUsuarios, this.buscarNegocioPorLatLngDTO, this.markerUsuario, this.map, configuraciones.icono_tu);
    }

    if (this.toogleUbicacion) {
      this.toogleUbicacion = false;
      this.iconGPS = "locate";
      this.obtenerUbicacionTR();
    } else {
      if (this.watch != null) {
        try {
          this.watch.unsubscribe();
        } catch (ex) {
        }
      }
      this.toogleUbicacion = true;
      this.iconGPS = "navigate";
      this.obtenerUbicacionEstatica();
    }

  }

  obtenerUbicacionEstatica() {
    var options = { enableHighAccuracy: true, timeout: 60000, maximumAge: 0 };
    this.geolocation.getCurrentPosition(options).then(data => {
      this.buscarNegocioPorLatLngDTO.point.coordinates = [data.coords.longitude, data.coords.latitude];
      this.utilComponent.removerLayerDeGrupo(this.grupoMarcadoresUsuarios);
      this.utilComponent.marcadorDefault(this.grupoMarcadoresUsuarios, this.buscarNegocioPorLatLngDTO, this.markerUsuario, this.map, configuraciones.icono_tu);
      this.contador = 0;
    }).catch((error) => {
      this.contador++;
    });
  }

  obtenerUbicacionTR() {
    this.watch = this.geolocation.watchPosition();
    this.watch.subscribe(
      (data) => {
        if (!this.toogleUbicacion) {
          this.buscarNegocioPorLatLngDTO.point.coordinates = [data.coords.longitude, data.coords.latitude];
          this.utilComponent.removerLayerDeGrupo(this.grupoMarcadoresUsuarios);
          this.utilComponent.marcadorDefault(this.grupoMarcadoresUsuarios, this.buscarNegocioPorLatLngDTO, this.markerUsuario, this.map, configuraciones.icono_tu_tr);
          this.contador = 0;
        }
      },
      (error) => {
        this.contador++;
      },
      {
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true
      }
    );
  }


  // BUSCAR NEGOCIOS
  buscarNegocios( pagina: number ) {
    this.utilComponent.removerLayerDeGrupo(this.grupoMarcadoresNegocio);
    this.serviceObtenerNegocios( pagina );
  }

  // MOSTRAR MAS
  mostrarMas(  ) {  
    this.pagina = this.pagina +=1; 
    this.serviceObtenerNegocios( this.pagina ); 
  }

  serviceObtenerNegocios( pagina: number ) {

    if (this.buscarNegocioPorLatLngDTO.busqueda.trim() == "") {
      return;
    }

    this.translate.get('aplicacion.inicio').subscribe((idioma: any) => {//-- INICIA TRADUCCION
      this.loading.present(idioma.buscando);// INICIANDO SESIÓN
      let configuracionesIniciales = <Configuraciones>JSON.parse(localStorage.getItem(configuraciones.datos.configuracionesIniciales));
      this.negocioService.buscar( pagina , configuracionesIniciales.establecimientosPorPeticion, this.buscarNegocioPorLatLngDTO).subscribe((data: Respuesta) => {

        let pageable: Pageable = <Pageable>data.cuerpo;
        this.negocios = <Negocio[]>pageable.content;

        this.negocios.forEach(negocio => {

          var peligro = '<img src="' + configuraciones.icono_peligro + '" height="20px" width="20px"/>';
          var favoritos = '<img src="' + configuraciones.icono_favorito + '" height="20px" width="20px"/>';

          let contenido =
            "<b>" + negocio.nombre + "</b>"
            + "<br>"
            + idioma.tipo_actividad + negocio.tipoActividad.etiqueta
            + "<br>"
            + idioma.tipo_negocio + negocio.tipoNegocio.etiqueta
            + "<br>"
            + idioma.correo + negocio.contactos[0].correo
            + "<br>"
            + idioma.telefono + negocio.contactos[0].telefono
            + "<br>"
            + "<b id='repoNeg' reporteNegocio-id=" + negocio.id + " style='color: blue; float: left;' >" + peligro + " " + idioma.reportar_negocio + "</b>"
            + "<b id='fav' favoritos-id=" + negocio.id + " style='color: blue; float: right;' >" + favoritos + " " + idioma.anhadir_favoritos + "</b>"
            + "<br>"
            + "<br>";
          this.mostrarNegocio(negocio, idioma, contenido);
        });

        if (this.negocios.length <= 0) {
          this.utilComponent.presentToast(idioma.no_hay_negocios);
        } else {
          this.utilComponent.presentToast(idioma.exito);
        }

        this.map.addLayer(this.grupoMarcadoresNegocio);
        this.loading.dismiss();

      }), (err: HttpErrorResponse) => {
        this.loading.dismiss();
        this.utilComponent.showAlert("", "", "");
      };

    });//-- TERMINA TRADUCCION

  }

  mostrarFavorito() {
    let favorito = <Favoritos>JSON.parse(localStorage.getItem(configuraciones.datos.favorito));
    console.log(JSON.stringify(favorito));
    if (favorito != null) {
      this.translate.get('aplicacion.inicio').subscribe((idioma: any) => {//-- INICIA TRADUCCION
        var peligro = '<img src="' + configuraciones.icono_peligro + '" height="20px" width="20px"/>';
        var favoritos = '<img src="' + configuraciones.icono_favorito + '" height="20px" width="20px"/>';
        let contenido =
          "<b>" + favoritos + "  " + favorito.establecimiento.nombre + "</b>"
          + "<br>"
          + idioma.tipo_actividad + favorito.establecimiento.tipoActividad.etiqueta
          + "<br>"
          + idioma.tipo_negocio + favorito.establecimiento.tipoNegocio.etiqueta
          + "<br>"
          + idioma.correo + favorito.establecimiento.contactos[0].correo
          + "<br>"
          + idioma.telefono + favorito.establecimiento.contactos[0].telefono
          + "<br>"
          + "<b id='repoNeg' reporteNegocio-id=" + favorito.establecimiento.id + " style='color: blue; float: left;' >" + peligro + " " + idioma.reportar_negocio + "</b>"
          + "<br>"
          + "<br>";
        this.mostrarNegocio(favorito.establecimiento, idioma, contenido);
      });
      this.map.addLayer(this.grupoMarcadoresNegocio);
    }

  }

  mostrarNegocio(negocio: Negocio, idioma: any, contenido: string) {

    if (negocio.latLng == null) {
      return;
    }

    let posicion = latLng(negocio.latLng.coordinates[1], negocio.latLng.coordinates[0]);
    let marker = this.utilComponent.crearMarcador(posicion, false, configuraciones.icono_negocio);

    marker.bindPopup(contenido).openPopup();
    let self = this;
    marker.on('popupopen', function () {

      // REPORTAR NEGOCIO
      self.elementRef.nativeElement.querySelector("#repoNeg")
        .addEventListener('click', (e) => {
          let negocio = e.target.getAttribute("reporteNegocio-id");
          self.reporteNegocio(negocio);
        });

      // FAVORITOS
      self.elementRef.nativeElement.querySelector("#fav")
        .addEventListener('click', (e) => {
          let negocio = e.target.getAttribute("favoritos-id");
          self.agregarFavoritos(negocio);
        });

    });
    this.grupoMarcadoresNegocio.addLayer(marker);
    this.utilComponent.mover(posicion, this.map);
  }


  async reporteNegocio(idNegocio: string) {

    let indice = this.negocios.findIndex(negocio => negocio.id === Number(idNegocio));
    let negocio = this.negocios[indice];

    const modal = await this.modalController.create({
      component: ReportePage,
      cssClass: 'my-custom-modal-css',
      componentProps: { "data": negocio }
    });
    return await modal.present();
  }

  agregarFavoritos(idNegocio: string) {

    this.translate.get('aplicacion.inicio').subscribe((idioma: any) => {//-- INICIA TRADUCCION
      this.loading.present(idioma.guardando_negocio);// INICIANDO SESIÓN 
      let indice = this.negocios.findIndex(negocio => negocio.id === Number(idNegocio));
      let negocio = this.negocios[indice];
      this.favoritosService.agregarFavorito(negocio).subscribe((data: Respuesta) => {
        this.loading.dismiss();
        this.utilComponent.showAlert(idioma.favorito, idioma.exito, idioma.agregado_a_favoritos);
      }), (err: HttpErrorResponse) => {
        this.loading.dismiss();
      };

    });
  }



  // NAVEGA A LA BUSQUEDA MANUAL
  async navToBuscarManual() {

    let self = this;
    const modal = await this.modalController.create({
      component: BusquedaManualPage,
      cssClass: 'my-custom-modal-css',
      componentProps: { "data": this.buscarNegocioPorLatLngDTO }
    });

    modal.onDidDismiss()
      .then((buscarNegocioPorLatLngDTO) => {

        if (this.grupoMarcadoresUsuarios.getLayers().length <= 1) {
          this.translate.get('aplicacion.inicio').subscribe((idioma: any) => {//-- INICIA TRADUCCION
            self.utilComponent.presentToast(idioma.necesitas_indicar_lugar_busqueda);
          });
          self.utilComponent.marcadorDefault(self.grupoMarcadoresUsuarios, self.buscarNegocioPorLatLngDTO, self.markerUsuario, self.map, configuraciones.icono_tu);
        } else {
          self.utilComponent.actualizaArea(self.map, self.buscarNegocioPorLatLngDTO);
        }

        this.buscarNegocios( 0 );

      });

    return await modal.present();
  }



}
