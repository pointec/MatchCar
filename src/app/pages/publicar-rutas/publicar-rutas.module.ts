import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicarRutasPageRoutingModule } from './publicar-rutas-routing.module';

import { PublicarRutasPage } from './publicar-rutas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicarRutasPageRoutingModule
  ],
  declarations: [PublicarRutasPage]
})
export class PublicarRutasPageModule {}
