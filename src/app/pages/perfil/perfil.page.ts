import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  id: any
  autos: any;
  patente: any;
  marca: any;
  user: any;
  arr: any;

  constructor(private router: Router,
    private DbService: DbService,
    private alertController: AlertController) { }


  agregarAuto() {
    this.router.navigate(['/autos']);
  }

  async eliminarAuto() {
    this.id = localStorage.getItem('id');
    this.patente = localStorage.getItem('patente');
    const alert = await this.alertController.create({
      header: '¿Quieres eliminar este auto? ¡No se eliminarán tus viajes!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',

        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            this.DbService.eliminaAuto(this.patente, this.id);
            this.DbService.presentToast("El auto ha sido eliminado");
            this.router.navigate(['/perfil']);

          },
        },
      ],
    });

    await alert.present();

  }


  editarFoto() {
    console.log("funcion para cambiar foto")
  }

  async elegirAuto(e: any) {
    const alert = await this.alertController.create({
      header: '¿Quieres usar este auto para publicar rutas?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',

        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            let arr = e.detail.value.split('|');
            this.DbService.activarAuto(arr);
            console.log(arr[0] + ' | ' + arr[1])
            localStorage.setItem('marca', arr[0])
            localStorage.setItem('patente', arr[1])
            this.DbService.presentToast("El auto ha sido elegido");

          },
        },
      ],
    });

    await alert.present();

  }

  cerrarSesion() {
    localStorage.clear();
    console.log("cierra sesion");
    this.router.navigate(['/login']);
  }

  cambiarClave() {
    this.router.navigate(['/clave']);

  }

  ObtieneAuto() {

    this.id = localStorage.getItem('id');

    this.DbService.ObtenerAutos(parseInt(this.id)).then((res: any) => {
      this.autos = res;



    }, (error) => {
      console.log(error);
    })
  }

  ionViewDidEnter() {

    this.user = localStorage.getItem("user");
    this.ObtieneAuto();
  }

  ngOnInit() {
  }

}
