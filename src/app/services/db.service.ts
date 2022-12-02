import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { JsonService } from 'src/app/services/json.service';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  public database!: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  tablaUsuario: string = "CREATE TABLE IF NOT EXISTS usuarios(id integer(2) PRIMARY KEY NOT NULL, nombre VARCHAR(50) NOT NULL, clave VARCHAR(50) NOT NULL);";
  tablaViajes: string = "CREATE TABLE IF NOT EXISTS viajes(id integer PRIMARY KEY autoincrement, origen VARCHAR(50) NOT NULL, destino VARCHAR(50) NOT NULL, asientos integer(2), estado integer(2), tipoUsuario VARCHAR(50), precio VARCHAR(10), idUsuario integer, patente VARCHAR(50),marca VARCHAR(50),nombre VARCHAR(50));";
  tablaAutos: string = "CREATE TABLE IF NOT EXISTS autos(patente VARCHAR(50) PRIMARY KEY NOT NULL, idUsuario integer(2) NOT NULL, marca VARCHAR(50), activo integer(2));";
  registroAuto: string = "INSERT or IGNORE INTO autos(patente, idUsuario, marca, activo) VALUES (?,?,?,?);";
  registro: string = "INSERT or IGNORE INTO usuarios(id, nombre, clave) VALUES (?,?,?);";
  users: any;


  constructor(public toastController: ToastController,
    private platform: Platform,
    private sqlite: SQLite,
    private json: JsonService

  ) {
    //Creamos base de datos
    this.crearBD();

    //insertamos los datos usuarios de la API JSON a la BD SQLite
    this.json.getData().subscribe(async (res) => {
      this.users = res;
      for (const user of res) {
        await this.database.executeSql(this.registro, [user.id, user.nombre, user.clave]);
        console.log("insertando usuarios  al BD: " + user + " | " + res)

      }

    }, (error) => {
      console.log(error);
    });

    //Insertamos los datos autos de la API JSON a la BD SQLite
    this.json.getAuto().subscribe(async (res) => {
      this.users = res;

      for (const user of res) {
        await this.database.executeSql(this.registroAuto, [user.patente, user.id_usuario, user.marca, 0]);
        console.log("insertando autos a la BD: " + user + " | " + res)

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
      await this.database.executeSql(this.tablaUsuario, []);
      console.log("tabla usuarios creada")

      await this.database.executeSql(this.tablaViajes, []);
      console.log("tabla viajes creada")

      await this.database.executeSql(this.tablaAutos, []);
      console.log("tabla autos creada")

      this.isDbReady.next(true);
    } catch (e) { console.log(e); }
  }

  CrearViaje(origen: string, destino: string, asientos: string, estado: number, tipoUsuario: string, precio: string, idUsuario: number, patente: any, marca: any, nombre: string) {
    return new Promise((resolve, reject) => {
      let sql = "INSERT or IGNORE INTO viajes(origen, destino, asientos,estado,tipoUsuario,precio, idUsuario, patente, marca,nombre) VALUES (?,?,?,?,?,?,?,?,?,?);";
      this.database.executeSql(sql, [origen, destino, asientos, estado, tipoUsuario, precio, idUsuario, patente, marca, nombre]).then((data) => {
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

  ObtenerViajes(id: number) {
    return new Promise((resolve, reject) => {
      this.database.executeSql('SELECT * FROM viajes where idUsuario=?', [id]).then(res => {
        let arrayUser = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            arrayUser.push({
              id: res.rows.item(i).id,
              origen: res.rows.item(i).origen,
              destino: res.rows.item(i).destino,
              asientos: res.rows.item(i).asientos,
              estado: res.rows.item(i).estado,
              tipoUsuario: res.rows.item(i).tipoUsuario,
              precio: res.rows.item(i).precio,
              idUsuario: res.rows.item(i).idUsuario,
              marca: res.rows.item(i).marca,
              patente: res.rows.item(i).patente,
              nombre: res.rows.item(i).nombre,
            });

          }
        }
        resolve(arrayUser);
      }, (error) => {
        reject(error);
      })
    })
  }

  BuscarViajes(origen: string, destino: string, pasajeros: string, idUsuario: number) {
    return new Promise((resolve, reject) => {
      if (origen !== "" && destino !== "") {

      }
      this.database.executeSql('SELECT * FROM viajes where tipoUsuario="Conductor" and estado=1 and (origen=? or destino=? or asientos=?) and idUsuario<>?', [origen, destino, pasajeros, idUsuario]).then(res => {
        let arrayViajes = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            arrayViajes.push({
              id: res.rows.item(i).id,
              origen: res.rows.item(i).origen,
              destino: res.rows.item(i).destino,
              asientos: res.rows.item(i).asientos,
              estado: res.rows.item(i).estado,
              tipoUsuario: res.rows.item(i).tipoUsuario,
              precio: res.rows.item(i).precio,
              idUsuario: res.rows.item(i).idUsuario,
              marca: res.rows.item(i).marca,
              patente: res.rows.item(i).patente,
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

  ObtenerAutos(idUsuario: number) {
    return new Promise((resolve, reject) => {
      this.database.executeSql('SELECT * FROM autos WHERE idUsuario=?', [idUsuario]).then(res => {
        let arrayAuto = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            arrayAuto.push({
              id: res.rows.item(i).id,
              patente: res.rows.item(i).patente,
              marca: res.rows.item(i).marca,
              activo: res.rows.item(i).activo,
            });
            if(res.rows.item(i).activo==1){
              localStorage.setItem('marca', res.rows.item(i).marca)
              localStorage.setItem('patente', res.rows.item(i).patente)
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

agregaAuto(patente: string, idUsuario: number, marca: string) {
  return new Promise((resolve, reject) => {
    let sql = "INSERT or IGNORE INTO autos(patente, idUsuario, marca, 0) VALUES (?,?,?,?);";
    this.database.executeSql(sql, [patente, idUsuario, marca]).then((data) => {
      resolve(data);
    }, (error) => {
      reject(error);
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
}


