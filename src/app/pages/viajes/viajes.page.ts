import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  rutas: any;
  id: any;
  viajes: any;


  constructor(private DbService: DbService,
    private alertController: AlertController,
    private router: Router

  ) {


  }
  async finalizarViaje(idViaje: number) {


    const alert = await this.alertController.create({
      header: '¿Se realizó el viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',

        },
        {
          text: 'Sí, finalizar',
          role: 'confirm',
          handler: () => {
            this.DbService.terminarViaje(idViaje).then((res: any) => {
              this.presentAlert('Información', 'Viaje Terminado', 'Revisa el detalle en el menu mis viajes');
              this.router.navigate(['/menutabs/viajes']);
            }, (error) => {
              console.log(error);
            })


          },
        },
      ],
    });

    await alert.present();

  }

  MostrarRutas() {
    this.id = localStorage.getItem('id');
    this.DbService.ObtenerRutas(this.id).then((res: any) => {
      console.log("Mostramos Ruta conductor" + JSON.stringify(res[0]));
      this.rutas = res;

    }, (error) => {
      console.log(error);
    })
  }

  MostrarViajes() {
    this.id = localStorage.getItem('id');
    this.DbService.ObtenerViajes(this.id).then((res: any) => {
      console.log("Mostramos viaje conductor" + JSON.stringify(res[0]));
      this.viajes = res;

    }, (error) => {
      console.log(error);
    })
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






  ionViewDidEnter() {
    this.MostrarRutas();
    this.MostrarViajes();

  }




  ngOnInit() {
  }

}
