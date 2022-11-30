import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';




@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  id:any
  autos: any;
  patente: any;
  marca: any;

  constructor(private router:Router,
    private DbService:DbService) { }


  agregarAuto(){
    this.router.navigate(['/autos']);
  }

  eliminarAuto(){


  }


  editarFoto(){
  console.log("funcion para cambiar foto")
  }

  ObtieneAuto(){
    
    this.id = localStorage.getItem('id');
  
    this.DbService.ObtenerAutos(parseInt(this.id)).then((res: any)=>{
      console.log("Imprimo res: " + res)
      this.autos= res;
      console.log("Imprimo auto de obtieneAuto: " + this.autos)
      
    },(error)=> {console.log(error);
    })
  }

  ionViewDidEnter(){
    this.patente = localStorage.getItem('patente');
    this.marca = localStorage.getItem('marca');
    this.ObtieneAuto();
  }

  ngOnInit() {
  }

}
