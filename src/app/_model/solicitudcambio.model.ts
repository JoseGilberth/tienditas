import { Negocio } from './negocio.model';
import { Usuario } from './usuario.model';

export class SolicitudCambio {

    id: number;
    establecimiento: Negocio;
    usuarioPublico: Usuario;
    comentario: string;
    tipoError: TipoError;

    constructor() {
        this.comentario = "";
    }

}
export class TipoError {

    id: number;
    etiqueta: string; 
    
    
}