import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
})
export class PublicarPage implements OnInit {
  result: string;

  constructor(private router:Router, private alertController: AlertController) { }

      //Interpolacion, envio de objeto
interpolacion={
  origen:"",
  destino:"",
  fecha: "",
  pasajeros:""
}



async publicarRutas() {
  const alert = await this.alertController.create({
    header: '¿Quieres publicar la ruta?',
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
