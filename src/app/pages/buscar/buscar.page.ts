import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';



@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {

  constructor(private router:Router) { }

  historial= [
    {
      "origen": "Las Petunias 3580",
      "destino": "Duoc Plaza Norte", 
      "pasajeros": 2
    },
    {
      "origen": "Duoc Plaza Norte",
      "destino": "Santa Filomena 145", 
      "pasajeros": 1
    },
    {
      "origen": "Independencia 1433",
      "destino": "Duoc Plaza Norte", 
      "pasajeros": 1
    }]
  
    //Interpolacion, envio de objeto
interpolacion={
  origen:"",
  destino:"",
  fecha: "",
  pasajeros:""
}

buscarRutas(){

  let navigationExtras: NavigationExtras = {
    state:{
      interpolacion: this.interpolacion
    }
  };
  this.router.navigate(['/buscar-viajes'],navigationExtras);
}

  ngOnInit() {
  }

}
