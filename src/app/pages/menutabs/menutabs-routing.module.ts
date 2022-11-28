import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenutabsPage } from './menutabs.page';

const routes: Routes = [
  {
    path: '',
    component: MenutabsPage,
    children:[
    {
      path:'buscar',
      loadChildren:()=>import('../buscar/buscar.module').then(m=>m.BuscarPageModule)

    },
    {
      path:'publicar',
      loadChildren:()=>import('../publicar/publicar.module').then(m=>m.PublicarPageModule)

    },
    {
      path:'viajes',
      loadChildren:()=>import('../viajes/viajes.module').then(m=>m.ViajesPageModule)

    },
    {
      path:'perfil',
      loadChildren:()=>import('../perfil/perfil.module').then(m=>m.PerfilPageModule)

    },
    {
      path:'',
      redirectTo:'/menutabs/buscar',
      pathMatch:'full'
    }
    
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenutabsPageRoutingModule {}
