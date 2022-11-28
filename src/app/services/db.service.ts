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
  tablaViajes: string = "CREATE TABLE IF NOT EXISTS viajes(id integer PRIMARY KEY autoincrement, origen VARCHAR(50) NOT NULL, destino VARCHAR(50) NOT NULL, asientos integer(2), estado integer(2), tipoUsuario VARCHAR(50), precio integer(50));";
  registro: string = "INSERT or IGNORE INTO usuarios(id, nombre, clave) VALUES (?,?,?);";
  users: any;

  constructor(public toastController: ToastController,
    private platform: Platform,
    private sqlite: SQLite,
    private json: JsonService

  ) {
    this.crearBD();

    this.json.getData().subscribe(async (res) => {
      this.users = res;
      for (const user of res) {
        await this.database.executeSql(this.registro, [user.id, user.nombre, user.clave]);
        console.log("insertando: " + user)
        // this.presentToast("Se inserto 1 usuario");
        // console.log("Se inserto" + user + " del JSON");
      }
      // console.log(res);
    }, (error) => {
      console.log(error);
    });

  }


  crearBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'serviexpress.db',
        location: 'default'

      }).then((db: SQLiteObject) => {
        this.database = db;
        this.presentToast("BD Creada");
        console.log("la base fue creada");
        this.crearTablas();
      }).catch((error) => { console.log(error) });
    })
  }



  async crearTablas() {
    try {
      await this.database.executeSql(this.tablaUsuario, []);
      console.log("tabla creada")
      this.presentToast("Tabla Creada");

      await this.database.executeSql(this.tablaViajes, []);
      

      this.isDbReady.next(true);
    } catch (e) { console.log(e); }
  }

  CrearViaje(origen: string, destino: string, asientos: string, estado: number, tipoUsuario: string, precio:  number){
    return new Promise ((resolve,reject)=>{
      let sql ="INSERT or IGNORE INTO viajes(origen, destino, asientos,estado,tipoUsuario,precio) VALUES (?, ?, ?,?,?,?);";
      this.database.executeSql(sql,[origen, destino, asientos, estado, tipoUsuario, precio]).then((data)=>{
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
            });
            
          }
        }
        resolve(arrayUser);
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


