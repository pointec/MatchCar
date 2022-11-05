import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-buscar-viajes',
  templateUrl: './buscar-viajes.page.html',
  styleUrls: ['./buscar-viajes.page.scss'],
})
export class BuscarViajesPage implements OnInit {
  getting: any;


  constructor(private router:Router,
    private activatedrouter:ActivatedRoute,
    private alertController: AlertController) { 
     
     this.activatedrouter.queryParams.subscribe(params =>{
       if (this.router.getCurrentNavigation().extras.state){
         this.getting = this.router.getCurrentNavigation().extras.state.interpolacion;
         console.log(this.getting)
       }
 
     });
     
     
     
    }

    rutas= [
      { 
        "conductor":"Juan Muñoz",
        "origen": "Las Petunias 3580",
        "destino": "Duoc Plaza Norte", 
        "asientos": 2,
        "vehiculo":"Pegueot 8",
        "precio":"$1.500",
        "patente":"PSDH47"
      },
      {
        "conductor":"Esteban Caro",
        "origen": "Duoc Plaza Norte",
        "destino": "Santa Filomena 145", 
        "asientos": 1,
        "vehiculo":"Citroen C3",
        "precio":"$1.800",
        "patente":"OTPR87"
      },
      {
        "conductor":"Daniela Medina",
        "origen": "Independencia 1433",
        "destino": "Duoc Plaza Norte", 
        "asientos": 1,
        "vehiculo":"Chevrolet Sail",
        "precio":"$1.000",
        "patente":"PRTD11"
      }]
  

    
      
        async MakeMacth() {
          const alert = await this.alertController.create({
            header: '¿Quieres confirmar la ruta con este conductor?',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
              
              },
              {
                text: 'Confirmar',
                role: 'confirm',
                handler: () => {
                  this.router.navigate(['/menutabs/viajes']);
                },
              },
            ],
          });
      
          await alert.present();
      
   
        }

      

  ngOnInit() {
  }

}
