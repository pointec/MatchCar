import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-publicar-rutas',
  templateUrl: './publicar-rutas.page.html',
  styleUrls: ['./publicar-rutas.page.scss'],
})
export class PublicarRutasPage implements OnInit {
  getting: any;


  constructor(private router:Router,
    private activatedrouter:ActivatedRoute,
    private alertController: AlertController) { 
     
    //  this.activatedrouter.queryParams.subscribe(params =>{
    //    if (this.router.getCurrentNavigation().extras.state){
    //      this.getting = this.router.getCurrentNavigation().extras.state.interpolacion;
    //      console.log(this.getting)
    //    }
 
    //  });
     
     
     
    }

  ngOnInit() {
  }

}