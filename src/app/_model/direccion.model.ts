import { TipoVialidad } from "./tipovialidad.model";
import { TipoAsentamiento } from "./tipoasentamiento.model";
import { TipoMunicipio } from "./tipomunicipio.model";

export class Direccion {
    public id: number;
    public version: number;
    public callePrincipal: string;
    public tipoVialidadPrincipal: TipoVialidad;
    public calle1: string;
    public tipoVialidad1: TipoVialidad;
    public calle2: string;
    public tipoVialidad2: TipoVialidad;
    public calle3: string;
    public tipoVialidad3: TipoVialidad;
    public numeroExterior: string;
    public letraExterior: string;
    public edificio: string;
    public edificio2: string;
    public numeroInterior: string;
    public letraInterior: string;
    public tipoAsentamiento: TipoAsentamiento;
    public codigoPostal: string;
    public tipoMunicipio: TipoMunicipio;
    public ageb: string;
    public manzana: string;
}
