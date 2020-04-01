
export class Usuario {
    public id: number;
    public username: string;
    public correo: string;
    public nombre: string;
    public apellido1: string;
    public apellido2: string;
    public password: String;
    public repetirPassword: String;
    public permisos: string
    public motivosAltaBaja: string
    public fechaAlta: string;
    public ultimaActualizacion: Date;
    public enabled: boolean;

    constructor() {
        this.enabled = true;
        this.ultimaActualizacion = new Date();
        this.password = null;
        this.repetirPassword = null;
    }
}
