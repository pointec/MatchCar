
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {
  rutas: any;
  user: any;
  id: any;

  

  constructor(private router:Router,private DbService2:DbService,
    private alertController: AlertController,
    ) { }

 
  
    //Interpolacion, envio de objeto
interpolacion={
  origen:"",
  destino:"",
  pasajeros:""
}

buscarRutas(){
  
  this.DbService2.BuscarViajes(this.interpolacion.origen, this.interpolacion.destino, this.interpolacion.pasajeros, this.id ).then((res)=>{
    this.rutas= res;
    
  },(error)=> {console.log(error);
  })
  this.user=localStorage.getItem('user')  
  
}



async confirmarRuta(origen: string, destino: string, asientos: string, estado: number, tipoUsuario: string, precio:  string, idUsuario: number, patente: any, marca:any, nombre:any) {
  const alert = await this.alertController.create({
    header: '¿Quieres confirmar la ruta hacia ' + destino,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      
      },
      {   
        text: 'Confirmar',
        role: 'confirm',
        handler: () => {
       
          this.DbService2.CrearViaje(origen,destino,asientos,estado,tipoUsuario,precio,this.id,patente,marca,nombre);
          console.log("Viaje ingresado con id: " + this.id )
          this.DbService2.presentToast("Ruta confirmada, revisa el detalle en la sección de viajes");
          this.router.navigate(['/menutabs/viajes']);
        },
      },
    ],
  });

  await alert.present();


}

  ngOnInit() {
    this.id = localStorage.getItem("id");
    this.user = localStorage.getItem("user");

  }

}
