import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
})
export class PublicarPage implements OnInit {
  patente: any;
  marca: any;
  //result: string;

  constructor(private router: Router,
    private alertController: AlertController,
    private DbService: DbService,
    private toastController: ToastController,) { }

  //Interpolacion, envio de objeto
  interpolacion = {
    origen: "",
    destino: "",
    asientos: "",
    estado: 1,
    tipoUsuario: "Conductor",
    precio: ""
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
            this.DbService.CrearViaje(this.interpolacion.origen, this.interpolacion.destino, this.interpolacion.asientos, this.interpolacion.estado, this.interpolacion.tipoUsuario, this.interpolacion.precio, this.id, this.patente, this.marca, this.user);
            console.log("Viaje ingresado con id: " + this.id)
            this.DbService.presentToast("Ruta registrada");
            this.router.navigate(['/menutabs/viajes']);
          },
        },
      ],
    });

    await alert.present();


  }

  async presentToast(message: string, duration?: number): Promise<void> {
    const toast = await this.toastController.create(
      {
        message: message,
        duration: duration ? duration : 2000,
        color: 'warning'
      }
    );
    toast.present();
  }

  async presentAlert(header: string,subHeader: string,message:string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }


  ngOnInit() {
  }

  ionViewDidEnter() {
    this.id = localStorage.getItem('id');

    this.DbService.ObtenerAutos(parseInt(this.id)).then((res: any) => {
     

    }, (error) => {
      console.log(error);
    })

    if (localStorage.getItem("patente")) {
      this.patente = localStorage.getItem("patente");
      this.marca = localStorage.getItem("marca");
    }
    else {
      this.presentAlert('Información','Auto no asignado','Debes elegir un auto para publicar rutas, ve a tu perfil y selecciona uno');
      this.router.navigate(['/menutabs/perfil']);

    }

  }

}
