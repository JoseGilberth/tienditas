import { TipoActividad } from "./tipoactividad.model";
import { TipoOcupante } from "./tipoocupante.model";
import { Direccion } from "./direccion.model";
import { CentroComercial } from "./centrocomercial.model";
import { Contacto } from "./contacto.model";
import { TipoNegocio } from "./tiponegocio.model";


export class Negocio {
    public id: number;
    public version: number;
    public latLng: LatLng;
    public idDenue: string;
    public nombre: string;
    public razonSocial: string;
    public tipoActividad: TipoActividad;
    public tipoOcupante: TipoOcupante;
    public direccion: Direccion;
    public centrosComerciales: CentroComercial[];
    public numeroLocal: string;
    public contactos: Contacto[];
    public tipoNegocio: TipoNegocio;
    public fechaAlta: string;
}

export class LatLng {
    public type: number;
    public coordinates: number[];
}

