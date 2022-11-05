import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenutabsPageRoutingModule } from './menutabs-routing.module';

import { MenutabsPage } from './menutabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenutabsPageRoutingModule
  ],
  declarations: [MenutabsPage]
})
export class MenutabsPageModule {}
