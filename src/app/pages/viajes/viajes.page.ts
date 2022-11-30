import { Component, OnInit } from '@angular/core';
import { parse } from 'path';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {
  users: any;


  
  constructor(private DbService:DbService
   
    ) { 

  
    }

  // rutas= [
  //   { 
  //     "conductor":"Juan Muñoz",
  //     "origen": "Las Petunias 3580",
  //     "destino": "Duoc Plaza Norte", 
  //     "asientos": 2,
  //     "vehiculo":"Pegueot 8",
  //     "precio":"$1.500",
  //     "patente":"PSDH47",
  //     "fecha":"10-11-2022",
  //     "viajes":17,
  //     "tipo_viaje":"Pasajero",
  //     "pasajero":"Christian Caroca"
  //   },
  //   {
  //     "conductor":"Esteban Caro",
  //     "origen": "Duoc Plaza Norte",
  //     "destino": "Santa Filomena 145", 
  //     "asientos": 1,
  //     "vehiculo":"Citroen C3",
  //     "precio":"$1.800",
  //     "patente":"OTPR87",
  //     "fecha":"04-11-2022",
  //     "viajes":15,
  //     "tipo_viaje":"Conductor",
  //     "pasajero":"Luis Fuentes"
  //   },
  //   {
  //     "conductor":"Daniela Medina",
  //     "origen": "Independencia 1433",
  //     "destino": "Duoc Plaza Norte", 
  //     "asientos": 1,
  //     "vehiculo":"Chevrolet Sail",
  //     "precio":"$1.000",
  //     "patente":"PRTD11",
  //     "fecha":"03-11-2022",
  //     "viajes":7,
  //     "tipo_viaje":"Pasajero",
  //     "pasajero":"Daniela Carvajal"
  //   }]

  MostrarViajes(){
    this.DbService.ObtenerViajes().then((res: any)=>{
      console.log("Mostramos viaje" + JSON.stringify(res[0]));
      this.users=res;
      
    },(error)=> {console.log(error);
    })
  }







ionViewDidEnter(){
  this.MostrarViajes();
  
}




  ngOnInit() {
  }

}
