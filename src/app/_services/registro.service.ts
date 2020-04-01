import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Login } from '../_dto/out/login.model';
import { Token } from '../_model/token.model';
import { Registro } from '../_dto/out/registro.model';
import { Respuesta } from '../_dto/out/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private registroUrl: string = `${environment.host}${environment.cuenta.base}${environment.cuenta.post.registro}`;

  constructor(private http: HttpClient) { }

  registrarse(registro: Registro): Observable<Respuesta> {
    return this.http.post<Respuesta>(this.registroUrl, registro);
  }




}
