import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'menutabs',
    loadChildren: () => import('./pages/menutabs/menutabs.module').then( m => m.MenutabsPageModule)
  },
  {
    path: 'buscar',
    loadChildren: () => import('./pages/buscar/buscar.module').then( m => m.BuscarPageModule)
  },
  {
    path: 'publicar',
    loadChildren: () => import('./pages/publicar/publicar.module').then( m => m.PublicarPageModule)
  },
  {
    path: 'viajes',
    loadChildren: () => import('./pages/viajes/viajes.module').then( m => m.ViajesPageModule)
  },
 
  {
    path: 'publicar-rutas',
    loadChildren: () => import('./pages/publicar-rutas/publicar-rutas.module').then( m => m.PublicarRutasPageModule)
  },
  {
    path: 'autos',
    loadChildren: () => import('./pages/autos/autos.module').then( m => m.AutosPageModule)
  },
  {
    path: 'clave',
    loadChildren: () => import('./pages/clave/clave.module').then( m => m.ClavePageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/error/error.module').then( m => m.ErrorPageModule)
  },
 


 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
