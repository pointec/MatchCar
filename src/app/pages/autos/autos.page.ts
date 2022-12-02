import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';


@Component({
  selector: 'app-autos',
  templateUrl: './autos.page.html',
  styleUrls: ['./autos.page.scss'],
})
export class AutosPage implements OnInit {
auto={
  marca: '',
  patente:''
}
id:any;
  constructor(private alertController:AlertController,
    private DbService:DbService,
    private router:Router) { }

  async agregarAuto(){
    this.id= localStorage.getItem('id');

    const alert = await this.alertController.create({
      header: '¿Quieres agregar este auto??',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',

        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            this.DbService.agregaAuto(this.auto.patente, this.id, this.auto.marca);
            this.DbService.presentToast("El auto ha sido agregado, seleccionalo si quieres dejarlo activo");
            this.router.navigate(['/perfil']);

          },
        },
      ],
    });

    await alert.present();
    //agregaAuto
  }

  ngOnInit() {
  }

}
