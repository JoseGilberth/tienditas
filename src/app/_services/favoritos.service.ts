import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Negocio } from '../_model/negocio.model';
import { Respuesta } from '../_dto/out/respuesta.model';
import { Favoritos } from '../_model/favoritos';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  private addFav: string = `${environment.host}${environment.favoritos.base}${environment.favoritos.post.agregarFavorito}`;
  private listFav: string = `${environment.host}${environment.favoritos.base}${environment.favoritos.get.listaTodos}`;
  private removeFav: string = `${environment.host}${environment.favoritos.base}${environment.favoritos.delete.eliminar}`;

  constructor(private http: HttpClient) { }

  listaFavoritos(): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.listFav}`);
  }

  agregarFavorito(negocio: Negocio) {
    return this.http.post(`${this.addFav}`, negocio);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.removeFav}/${id}`);
  }


}
