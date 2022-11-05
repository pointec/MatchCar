import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajesPageRoutingModule } from './viajes-routing.module';

import { ViajesPage } from './viajes.page';
import {MatTabsModule} from '@angular/material/tabs';
import { BannerComponent } from 'src/app/components/banner/banner.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajesPageRoutingModule,
    MatTabsModule
  ],
  declarations: [ViajesPage,BannerComponent]
})
export class ViajesPageModule {}
