import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Negocio } from '../_model/negocio.model';
import { Respuesta } from '../_dto/out/respuesta.model';
import { Favoritos } from '../_model/favoritos';
import { UsuarioPublicoCambiarClaveDTO } from '../_dto/out/UsuarioPublicoCambiarClaveDTO.model';

@Injectable({
  providedIn: 'root'
})
export class RecuperarPasswordService {

  private recuperarPasswordURL: string = `${environment.host}${environment.cuenta.base}${environment.cuenta.post.recuperar_password}`; 

  constructor(private http: HttpClient) { }
 

  recuperarPassword(usuarioPublicoCambiarClaveDTO: UsuarioPublicoCambiarClaveDTO) {
    return this.http.post(`${this.recuperarPasswordURL}`, usuarioPublicoCambiarClaveDTO);
  }
 

}
