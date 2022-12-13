import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { JsonService } from 'src/app/services/json.service';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  public database!: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  tablaUsuarios: string = "CREATE TABLE IF NOT EXISTS usuarios(id_usuario integer(2) PRIMARY KEY NOT NULL, nombre VARCHAR(50) NOT NULL, clave VARCHAR(50) NOT NULL);";
  tablaAutos: string = "CREATE TABLE IF NOT EXISTS autos(patente VARCHAR(50) PRIMARY KEY NOT NULL, marca VARCHAR(50), activo integer(2), id_usuario_fk integer(2), FOREIGN KEY(id_usuario_fk) REFERENCES usuarios(id_usuario));";
  tablaRutas: string = "CREATE TABLE IF NOT EXISTS rutas(id_ruta integer PRIMARY KEY autoincrement, origen VARCHAR(50) NOT NULL, destino VARCHAR(50) NOT NULL, asientos_ofrecidos integer(2) NOT NULL,asientos_disponibles integer(2) NOT NULL, precio VARCHAR(10) NOT NULL, marca VARCHAR(50) NOT NULL,  patente VARCHAR(50) NOT NULL, estado integer(2) NOT NULL, id_usuario_fk integer, FOREIGN KEY(id_usuario_fk) REFERENCES usuarios(id_usuario) );";
  tablaViajes: string = "CREATE TABLE IF NOT EXISTS viajes(id_viaje integer PRIMARY KEY autoincrement, estado integer(2), id_ruta_fk integer, id_usuario_fk integer, FOREIGN KEY(id_usuario_fk) REFERENCES usuarios(id_usuario), FOREIGN KEY(id_ruta_fk) REFERENCES rutas(id_ruta));";
  registroUsuario: string = "INSERT or IGNORE INTO usuarios(id_usuario, nombre, clave) VALUES (?,?,?);";
  registroAuto: string = "INSERT or IGNORE INTO autos(patente, marca, activo, id_usuario_fk) VALUES (?,?,?,?);";

  users: any;
  autoP: any;
  asientos: any;
  


  constructor(public toastController: ToastController,
    private platform: Platform,
    private sqlite: SQLite,
    private json: JsonService,
    private alertController: AlertController,

  ) {
    //Creamos base de datos
    this.crearBD();

    //insertamos los datos usuarios de la API JSON a la BD SQLite
    this.json.getData().subscribe(async (res) => {
      this.users = res;
      for (const user of res) {
        await this.database.executeSql(this.registroUsuario, [user.id, user.nombre, user.clave]);
        console.log("insertando usuarios  a la BD: " + user + " | " + res)

      }

    }, (error) => {
      console.log(error);
    });

    //Insertamos los datos autos de la API JSON a la BD SQLite
    this.json.getAuto().subscribe(async (res) => {
      this.users = res;

      for (const auto of res) {
        await this.database.executeSql(this.registroAuto, [auto.patente, auto.marca, 0, auto.id_usuario]);
        console.log("insertando autos a la BD: " + auto + " | " + res)

      }

    }, (error) => {
      console.log(error);
    });

  }


  //funcion que crea la base de datos
  crearBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'MatchCar.db',
        location: 'default'

      }).then((db: SQLiteObject) => {
        this.database = db;

        console.log("la base fue creada");
        //Creamos tablas
        this.crearTablas();
      }).catch((error) => { console.log(error) });
    })
  }


  //Funcion que crea las tablas en la BD
  async crearTablas() {
    try {
      await this.database.executeSql(this.tablaUsuarios, []);
      console.log("tabla usuarios creada")

      await this.database.executeSql(this.tablaAutos, []);
      console.log("tabla autos creada")

      await this.database.executeSql(this.tablaRutas, []);
      console.log("tabla rutas creada")

      await this.database.executeSql(this.tablaViajes, []);
      console.log("tabla viajes creada")


      this.isDbReady.next(true);
    } catch (e) { console.log(e); }
  }



  CrearRuta(origen: string, destino: string, asientos: string, estado: number, tipoUsuario: string, precio: string, idUsuario: number, patente: any, marca: any, nombre: string) {
    return new Promise((resolve, reject) => {
      let sql = "INSERT or IGNORE INTO rutas(origen, destino, asientos_ofrecidos, asientos_disponibles,precio, marca, patente, estado, id_usuario_fk) VALUES (?,?,?,?,?,?,?,?,?);";
      this.database.executeSql(sql, [origen, destino, asientos,asientos,precio, marca, patente, estado, idUsuario]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  
  actualizaRuta(id_ruta: number, asientos_disponibles: number, estadoRuta:number){
    
    
    asientos_disponibles-=1;
    return new Promise ((resolve,reject)=>{
      let sql ="UPDATE rutas SET asientos_disponibles=?, estado=? where id_ruta=?;";
      
      this.database.executeSql(sql,[asientos_disponibles,estadoRuta,id_ruta]).then((data)=>{
        resolve(data);
      },(error)=>{reject(error);
      });
      });

  }


  CrearViaje(id_ruta: number, id_usuario: number, asientos_disponibles: number, estadoRuta: number){
    return new Promise((resolve, reject) => {
      let sql = "INSERT or IGNORE INTO viajes(estado, id_ruta_fk, id_usuario_fk) VALUES (?,?,?);";
      this.database.executeSql(sql, [0, id_ruta, id_usuario]).then((data) => {
      this.actualizaRuta(id_ruta, asientos_disponibles,estadoRuta);
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });

    

  }

  ObtenerUsuario(nombre: string) {
    return new Promise((resolve, reject) => {
      this.database.executeSql('SELECT * FROM usuarios WHERE nombre=?', [nombre]).then(res => {
        let arrayUser = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            arrayUser.push({
              id: res.rows.item(i).id_usuario,
              nombre: res.rows.item(i).nombre,
              clave: res.rows.item(i).clave,
            });
          }
        }
        resolve(arrayUser);
      }, (error) => {
        reject(error);
      })
    })

  }

  ObtenerUsuarios() {
    return new Promise((resolve, reject) => {
      this.database.executeSql('SELECT * FROM usuarios', []).then(res => {
        let arrayUser = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            arrayUser.push({
              id: res.rows.item(i).id,
              nombre: res.rows.item(i).nombre,
              clave: res.rows.item(i).clave,

            });
          }
        }
        resolve(arrayUser);
      }, (error) => {
        reject(error);
      })
    })
  }

  
  ObtenerRutas(id: number) {
    return new Promise((resolve, reject) => {
      this.database.executeSql('SELECT * FROM rutas where id_usuario_fk=?', [id]).then(res => {
        let arrayRutas = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            arrayRutas.push({
              id_ruta: res.rows.item(i).id_ruta,
              origen: res.rows.item(i).origen,
              destino: res.rows.item(i).destino,
              asientos_ofrecidos: res.rows.item(i).asientos_ofrecidos,
              asientos_disponibles: res.rows.item(i).asientos_disponibles,
              precio: res.rows.item(i).precio,
              marca: res.rows.item(i).marca,
              patente: res.rows.item(i).patente,
              estado: res.rows.item(i).estado,
              id_usuario_fk: res.rows.item(i).id_usuario_fk,
              
            });

          }
        }
        resolve(arrayRutas);
      }, (error) => {
        reject(error);
      })
    })
  }

  ObtenerViajes(id: number) {
    return new Promise((resolve, reject) => {
      this.database.executeSql('SELECT * FROM viajes v join rutas r on (v.id_ruta_fk=r.id_ruta) join usuarios u on (r.id_usuario_fk=u.id_usuario) where v.id_usuario_fk=?', [id]).then(res => {
        let arrayViajes = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            arrayViajes.push({
              id_ruta: res.rows.item(i).id_ruta,
              origen: res.rows.item(i).origen,
              destino: res.rows.item(i).destino,
              asientos_ofrecidos: res.rows.item(i).asientos_ofrecidos,
              asientos_disponibles: res.rows.item(i).asientos_disponibles,
              precio: res.rows.item(i).precio,
              marca: res.rows.item(i).marca,
              patente: res.rows.item(i).patente,
              estado: res.rows.item(i).estado,
              id_usuario_fk: res.rows.item(i).id_usuario_fk,
              nombre: res.rows.item(i).nombre,
              
            });

          }
        }
        resolve(arrayViajes);
      }, (error) => {
        reject(error);
      })
    })
  }

  BuscarRutas(origen: string, destino: string, pasajeros: number, idUsuario: number) {
    
  
      
    if (pasajeros > 7) {
      this.presentAlert('Información', 'Datos incorrectos', 'Debes indicar máximo 7 asientos');
      
    }
   
      return new Promise((resolve, reject) => {
        this.database.executeSql('SELECT * FROM rutas r join usuarios u on (r.id_usuario_fk=u.id_usuario) where r.estado=1 and r.asientos_disponibles>=1 and (r.origen=? or r.destino=? or r.asientos_disponibles=?) and r.id_usuario_fk<>?', [origen, destino, pasajeros, idUsuario]).then(res => {
          let arrayRutas = [];
          if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
              arrayRutas.push({
                id_ruta: res.rows.item(i).id_ruta,
                origen: res.rows.item(i).origen,
                destino: res.rows.item(i).destino,
                asientos_ofrecidos: res.rows.item(i).asientos_ofrecidos,
                asientos_disponibles: res.rows.item(i).asientos_disponibles,
                precio: res.rows.item(i).precio,
                marca: res.rows.item(i).marca,
                patente: res.rows.item(i).patente,
                estado: res.rows.item(i).estado,
                id_usuario_fk: res.rows.item(i).id_usuario_fk,
                nombre: res.rows.item(i).nombre,
              });
  
            }
          }
          resolve(arrayRutas);
        }, (error) => {
          reject(error);
        })
      })

  
    
   
  }

  ObtenerAutos(idUsuario: number) {
    return new Promise((resolve, reject) => {
      this.database.executeSql('SELECT * FROM autos WHERE id_usuario_fk=?',[idUsuario]).then(res => {
        let arrayAuto = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            arrayAuto.push({
              id: res.rows.item(i).id_usuario_fk,
              patente: res.rows.item(i).patente,
              marca: res.rows.item(i).marca,
              activo: res.rows.item(i).activo,
            });
            if(res.rows.item(i).activo==1){
              localStorage.setItem('marca', res.rows.item(i).marca)
              localStorage.setItem('patente', res.rows.item(i).patente)
              localStorage.setItem('auto', res.rows.item(i).marca+"|"+res.rows.item(i).patente)
            this.autoP= localStorage.getItem('auto');
            }

          }
        }
        
        resolve(arrayAuto);
      }, (error) => {
        reject(error);
      })
    })
  }

  ObtenerAuto(idUsuario: number) {
    return new Promise((resolve, reject) => {
      this.database.executeSql('SELECT * FROM autos WHERE idUsuario=? and activo=1', [idUsuario]).then(res => {
        let arrayAuto = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            arrayAuto.push({
              id: res.rows.item(i).id,
              patente: res.rows.item(i).patente,
              marca: res.rows.item(i).marca,
              activo: res.rows.item(i).activo,
            });
          }
        }
        
        resolve(arrayAuto);
      }, (error) => {
        reject(error);
      })
    })
  }


  activarAuto(auto: any){
    return new Promise ((resolve,reject)=>{
      let sql ="UPDATE autos SET activo=1 where  patente=?;";
      console.log("prueba: " + auto[1]);
     
      this.database.executeSql(sql,[auto[1]]).then((data)=>{
        resolve(data);
      },(error)=>{reject(error);
      });
    });
  }


terminarViaje(idViaje: number){
  return new Promise ((resolve,reject)=>{
    let sql ="UPDATE viajes SET estado=0 where id=?;";
    
    this.database.executeSql(sql,[idViaje]).then((data)=>{
      resolve(data);
    },(error)=>{reject(error);
    });
    });
  }


cambiaClave(clave:string, idUsuario: number){
  return new Promise ((resolve,reject)=>{
    let sql ="UPDATE usuarios SET clave=? where id=?;";
    
    this.database.executeSql(sql,[clave, idUsuario]).then((data)=>{
      resolve(data);
    },(error)=>{reject(error);
    });
    });

}
agregaAuto(patente: string, idUsuario: number, marca: string) {
  return new Promise((resolve, reject) => {
    let sql = "INSERT or IGNORE INTO autos(patente, marca, activo, id_usuario_fk) VALUES (?,?,?,?);";
    this.database.executeSql(sql, [patente, marca,0, idUsuario]).then((data) => {
      resolve(data);
    }, (error) => {
      reject(error);
    });
  });
}

eliminaAuto(patente: string, idUsuario: number){
  return new Promise ((resolve,reject)=>{
    let sql ="DELETE FROM autos WHERE patente=? and idUsuario=?;";
    this.database.executeSql(sql,[patente, idUsuario]).then((data)=>{
      resolve(data);
    },(error)=>{reject(error);
    });
    });
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}


