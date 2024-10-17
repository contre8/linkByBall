import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ModifyFutbolistaComponent } from './modify-futbolista/modify-futbolista.component';
import { ExternalProfileComponent } from './external-profile/external-profile.component';
import { FutbolistaDashboardComponent } from './futbolista-dashboard/futbolista-dashboard/futbolista-dashboard.component';
import { FavoritosComponent } from '../favoritos/favoritos.component';
import { MisSolicitudesComponent } from '../solicitudes/mis-solicitudes.component';
import { BuscarVacantesComponent } from '../buscar-vacantes/buscar-vacantes/buscar-vacantes.component';

const routes: Routes = [
  { path: 'futbolista/perfil', component: ProfileComponent },
  { path: 'futbolista/modify-profile', component: ModifyFutbolistaComponent },
  { path: 'futbolista/perfil/:id', component: ExternalProfileComponent },
  { path: 'futbolista/home', component: FutbolistaDashboardComponent},
  { path: 'futbolista/favoritos', component: FavoritosComponent},
  { path: 'futbolista/mis-solicitudes', component: MisSolicitudesComponent},
  { path: 'futbolista/buscar-equipo', component: BuscarVacantesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FutbolistaRoutingModule { }
