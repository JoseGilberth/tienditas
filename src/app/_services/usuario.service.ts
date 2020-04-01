import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Respuesta } from '../_dto/out/respuesta.model';
import { Usuario } from '../_model/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private buscarURL: string = `${environment.host}${environment.usuarios.base}${environment.usuarios.get.obtenerPorToken}`;
  private actualizarURL: string = `${environment.host}${environment.usuarios.base}${environment.usuarios.put.actualizar}`;

  constructor(private http: HttpClient) { }

  obtenerPorToken(): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.buscarURL}`);

  }

  actualizar(usuario: Usuario): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${this.actualizarURL}`, usuario);
  }
  

}
