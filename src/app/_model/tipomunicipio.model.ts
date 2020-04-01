import { TipoEntidad } from "./tipoentidad.model";

export class TipoMunicipio {
    public id: number;
    public version: number;
    public clave: string;
    public etiqueta: string;
    public tipoEntidad: TipoEntidad;
}