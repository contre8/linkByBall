import { SearchComponent } from '../search/search.component';
import { FavoritosComponent } from './../favoritos/favoritos.component';
import { ModifyVacantesComponent } from './vacantes/modify-vacantes/modify-vacantes.component';
import { DashboardVacantesComponent } from './vacantes/vacantes-dashboard/vacantes-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileClubComponent } from './profile/profile.component';
import { ModifyClubComponent } from './modify-club/modify-club.component';
import { CreateVacanteComponent } from './vacantes/create-vacante/create-vacante.component';
import { DashboardClubComponent } from './club-dashboard/club-dashboard.component';
import { ExternalProfileComponent } from './external-profile/external-profile.component';
import { MisAvisosComponent } from './mis-avisos/mis-avisos.component';

const routes: Routes = [
  { path: 'club/perfil', component: ProfileClubComponent },
  { path: 'club/modify-profile', component: ModifyClubComponent },
  { path: 'club/crear-vacante', component: CreateVacanteComponent },
  { path: 'club/vacantes-dashboard', component: DashboardVacantesComponent},
  { path: 'club/modify-vacante/:id', component: ModifyVacantesComponent},
  { path: 'club/home', component: DashboardClubComponent},
  { path: 'club/perfil/:id', component: ExternalProfileComponent },
  { path: 'club/favoritos' , component: FavoritosComponent},
  { path: 'buscador', component: SearchComponent},
  { path: 'mis-avisos', component: MisAvisosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubRoutingModule { }
