import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Respuesta } from '../_dto/out/respuesta.model';
import { SolicitudCambio } from '../_model/solicitudcambio.model';


@Injectable({
  providedIn: 'root'
})
export class SolicitudCambioService {

  private buscarURL: string = `${environment.host}${environment.usuarios.base}${environment.usuarios.get.obtenerPorToken}`;
  private crearURL: string = `${environment.host}${environment.reporte.base}${environment.reporte.post.crear}`;

  constructor(private http: HttpClient) { }

  obtenerPorToken(): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.buscarURL}`);

  }

  crear(solicitudCambio: SolicitudCambio): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${this.crearURL}`, solicitudCambio);
  }


}
