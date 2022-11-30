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
  tablaViajes: string = "CREATE TABLE IF NOT EXISTS viajes(id integer PRIMARY KEY autoincrement, origen VARCHAR(50) NOT NULL, destino VARCHAR(50) NOT NULL, asientos integer(2), estado integer(2), tipoUsuario VARCHAR(50), precio VARCHAR(10), idUsuario integer, patente VARCHAR(50),marca VARCHAR(50));";
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
      
      let activo=0;
      for (const user of res) {
        if(activo==0){
          await this.database.executeSql(this.registroAuto, [ user.patente, user.id_usuario, user.marca,1]);
        }
        else{
          await this.database.executeSql(this.registroAuto, [ user.patente, user.id_usuario, user.marca,0]);
        }
        activo=1;
        
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

  CrearViaje(origen: string, destino: string, asientos: string, estado: number, tipoUsuario: string, precio:  string, idUsuario: number, patente: string, marca:string){
    return new Promise ((resolve,reject)=>{
      let sql ="INSERT or IGNORE INTO viajes(origen, destino, asientos,estado,tipoUsuario,precio, idUsuario, patente, marca) VALUES (?,?,?,?,?,?,?,?,?);";
      this.database.executeSql(sql,[origen, destino, asientos, estado, tipoUsuario, precio, idUsuario, patente, marca]).then((data)=>{
        resolve(data);
      },(error)=>{reject(error);
      });
    });
  }

  ObtenerUsuario(nombre: string){
    return new Promise ((resolve,reject) =>{
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
      },(error)=>{reject(error);
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

  ObtenerViajes() {
    return new Promise((resolve, reject) => {
      this.database.executeSql('SELECT * FROM viajes', []).then(res => {
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
            });
            
          }
        }
        resolve(arrayUser);
      }, (error) => {
        reject(error);
      })
    })
  }

  ObtenerAutos(idUsuario: number){
    return new Promise ((resolve,reject) =>{
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
          }
        }
        console.log("Imprimo objeto de autoObtenido: " + arrayAuto)
        resolve(arrayAuto);
      }, (error) => {
        reject(error);
      })
    })
  }

  ObtenerAuto(idUsuario: number){
    return new Promise ((resolve,reject) =>{
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
        console.log("Imprimo auto activo de usaurio: " + arrayAuto)
        resolve(arrayAuto);
      }, (error) => {
        reject(error);
      })
    })
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }
}


