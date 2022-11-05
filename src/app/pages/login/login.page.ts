import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formLogin: FormGroup;

  constructor(
    public fb: FormBuilder,
    private toastController:ToastController,
    private route:Router

  ) { 
    this.formLogin = this.fb.group({
      'usuario': new FormControl("",[Validators.required,Validators.email]),
      'contrasena': new FormControl("", [Validators.required])
    })
  }

  login(){
    if(this.formLogin.invalid){
      this.presentToast("El usuario o contraseña son incorrectos")

    }
    else{
      this.route.navigate(['/menutabs'])
    }
  }

  async presentToast(message:string, duration?:number): Promise<void>{
    const toast = await this.toastController.create(
      {
        message:message,
        duration:duration?duration:2000,
        color:'warning'
      }
    );
    toast.present();
  }

  ngOnInit() {
  }

}
