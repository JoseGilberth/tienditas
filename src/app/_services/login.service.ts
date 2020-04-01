import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Login } from '../_dto/out/login.model';
import { Token } from '../_model/token.model';
import { Respuesta } from '../_dto/out/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private obtenerToken: string = `${environment.host}${environment.login.base}${environment.login.post.token}`;
  private cerrarSesionURL: string = `${environment.host}${environment.login.base}${environment.login.get.cerrarSesion}`;

  constructor(private http: HttpClient) { }

  iniciarSesion(login: Login): Observable<Token> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': "Basic dGllbmRpdGFzOjEyMzQ1"
    });
    let body = `grant_type=password&username=${encodeURIComponent(login.username)}&password=${encodeURIComponent(login.password)}`;
    return this.http.post<Token>(this.obtenerToken, body, { headers });
  }


  cerrarSesion() {
    return this.http.get<Respuesta>(`${this.cerrarSesionURL}`);
  }

}
