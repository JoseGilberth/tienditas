// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  
  production: true,

  host: 'https://tienditas.com.mx:8445/proyecto',
  //host: 'http://192.168.10.146:8445/proyecto',
  
  // LOGIN
  login: {
    base: '/uaa',
    post: {
      token: "/oauth/token"
    },
    get: {
      cerrarSesion: "/publico/logout"
    }

  },

  // ESTABLECIMIENTOS
  establecimientos: {
    base: '/micro-establecimiento/establecimiento',
    post: {
      buscar: "/buscar",
    },
    get: {

    }
  },

  // REPORTE
  reporte: {
    base: '/micro-establecimiento/solicitud/cambio',
    post: {
      crear: "",
    },
    get: {

    }
  },
  

  // FAVORITOS
  favoritos: {
    base: '/micro-establecimiento/favoritos',
    post: {
      agregarFavorito: ""
    },
    get: {
      listaTodos: ""
    },
    delete:{
      eliminar: ""
    }
  },

  // CUENTA
  cuenta: {
    base: '/micro-usuarios/usuarios/publico',
    post: {
      registro: "/registro",
      favoritos: "/add/favoritos",
      recuperar_password: "/cuenta/cambiar/password"
    },
    get: {
      listaFav: "/lista/favoritos"
    }
  },

  // USUARIOS
  usuarios: {
    base: '/micro-usuarios/usuarios/publico',
    post: {
    },
    get: {
      obtenerPorToken: ""
    },
    put: {
      actualizar: ""
    }
  }



};

