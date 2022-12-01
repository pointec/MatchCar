import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
})
export class PublicarPage implements OnInit {
  patente: any;
  marca: any;
  //result: string;

  constructor(private router:Router, private alertController: AlertController,
    private DbService:DbService ) { }

      //Interpolacion, envio de objeto
interpolacion={
  origen:"",
  destino:"",
  asientos:"",
  estado:1,
  tipoUsuario:"Conductor",
  precio:""
}
id: any;
user: any;

async publicarRutas() {
  const alert = await this.alertController.create({
    header: '¿Quieres publicar la ruta hacia ' + this.interpolacion.destino,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      
      },
      {   
        text: 'Confirmar',
        role: 'confirm',
        handler: () => {
          this.id = localStorage.getItem("id");
          this.user = localStorage.getItem("user");
          this.DbService.CrearViaje(this.interpolacion.origen, this.interpolacion.destino, this.interpolacion.asientos, this.interpolacion.estado, this.interpolacion.tipoUsuario, this.interpolacion.precio, this.id,this.patente, this.marca, this.user);
          console.log("Viaje ingresado con id: " + this.id )
          this.DbService.presentToast("Ruta registrada");
          this.router.navigate(['/menutabs/viajes']);
        },
      },
    ],
  });

  await alert.present();


}

  ngOnInit() {
    this.patente = localStorage.getItem("patente");
    this.marca = localStorage.getItem("marca");
  }

}
