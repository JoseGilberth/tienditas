import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BuscarNegocioPorLatLngDTO } from '../_dto/out/buscarnegocioporlatlngdto.model';
import { Respuesta } from '../_dto/out/respuesta.model';
import { environment } from '../../environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  buscarURL: string = `${environment.host}${environment.establecimientos.base}${environment.establecimientos.post.buscar}`;
  constructor(private http: HttpClient) {  }

  buscar(p: number, s: number, buscarNegocioPorLatLngDTO: BuscarNegocioPorLatLngDTO): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${this.buscarURL}?page=${p}&size=${s}`, buscarNegocioPorLatLngDTO);
  }

}
