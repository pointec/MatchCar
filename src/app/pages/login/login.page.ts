import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { JsonService } from 'src/app/services/json.service';
import { DbService } from 'src/app/services/db.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formLogin: FormGroup;
  users: any;
  user: any;
  interpolacion = {
    nombre: "",
    clave: ""

  }
  id: any;
  auto: any;


  constructor(
    public fb: FormBuilder,
    private toastController: ToastController,
    private route: Router,
    private json: JsonService,
    private DbService: DbService

  ) {
    this.formLogin = this.fb.group({
      'usuario': new FormControl("", [Validators.required]),
      'contrasena': new FormControl("", [Validators.required])
    })
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

  LoginUsuario() {

      this.DbService.ObtenerUsuario(this.interpolacion.nombre).then((res2) => {
      this.user = res2;
      

      if (this.user.length == 0) {
        this.presentToast("Usuario no encontrado");
      } else if (this.user.length == 1 && this.user[0].nombre == this.interpolacion.nombre && this.user[0].clave == this.interpolacion.clave) {
        localStorage.setItem('id',this.user[0].id)
        localStorage.setItem('user',this.user[0].nombre)

        this.id =localStorage.getItem('id');

    //consultamos el auto del usuario para asignarlo a localstorage
    this.DbService.ObtenerAuto(this.id).then((res)=>{
      this.auto= res;
   
    
    },(error)=> {console.log(error);
    })
    

        this.route.navigate(["/menutabs"])
        //   this.database.UpdateActivo(this.interpolacion.email,this.active)
        
      } else {
        this.presentToast("Usuario o contrase??a incorrecta")
      }
    }, (error) => {
      console.log(error);
      this.presentToast("Error al obtener el usuario");
    });
  }

  ngOnInit() {

    if(localStorage.getItem('user')){
      this.route.navigate(["/menutabs"])
    }
  


  }

}
