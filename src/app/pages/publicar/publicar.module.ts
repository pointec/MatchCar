import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicarPageRoutingModule } from './publicar-routing.module';

import { PublicarPage } from './publicar.page';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';

import {MatNativeDateModule} from '@angular/material/core';
import { BannerComponent } from 'src/app/components/banner/banner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicarPageRoutingModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule
    

  ],
  declarations: [PublicarPage,BannerComponent]
})
export class PublicarPageModule {}
