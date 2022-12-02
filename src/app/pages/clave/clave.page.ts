import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-clave',
  templateUrl: './clave.page.html',
  styleUrls: ['./clave.page.scss'],
})
export class ClavePage implements OnInit {
  id:any;
  clave:any;

  constructor(private router: Router,
    private DbService: DbService,
    private alertController: AlertController) { }


  async cambiarClave() {
    this.id = localStorage.getItem('id');
    const alert = await this.alertController.create({
      header: '¿Estás seguro de cambiar la contraseña?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',

        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            this.DbService.cambiaClave(this.clave, this.id);
            this.DbService.presentToast("La contraseña se cambió satisfactoriamente");
            this.router.navigate(['/menutabs/perfil']);

          },
        },
      ],
    });

    await alert.present();

  }
  ngOnInit() {
  }

}
