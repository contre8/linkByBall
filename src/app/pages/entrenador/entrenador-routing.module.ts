import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileEntrenadorComponent } from './profile/profile.component';
import { ModifyEntrenadorComponent } from './modify-entrenador/modify-entrenador.component';
import { ExternalProfileComponent } from './external-profile/external-profile.component';
import { FavoritosComponent } from '../favoritos/favoritos.component';
import { MisSolicitudesComponent } from '../solicitudes/mis-solicitudes.component';
import { BuscarVacantesComponent } from '../buscar-vacantes/buscar-vacantes.component';
import { EntrenadorDashboardComponent } from './entrenador-dashboard/entrenador-dashboard.component';

const routes: Routes = [
  { path: 'entrenador/perfil', component: ProfileEntrenadorComponent },
  { path: 'entrenador/modify-profile', component: ModifyEntrenadorComponent },
  { path: 'entrenador/perfil/:id', component: ExternalProfileComponent },
  { path: 'entrenador/favoritos', component: FavoritosComponent},
  { path: 'entrenador/mis-solicitudes', component: MisSolicitudesComponent},
  { path: 'entrenador/buscar-equipo', component: BuscarVacantesComponent},
  { path: 'entrenador/home', component: EntrenadorDashboardComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntrenadorRoutingModule { }
