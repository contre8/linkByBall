import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileClubComponent } from './profile/profile.component';
import { ModifyClubComponent } from './modify-club/modify-club.component';
import { CreateVacanteComponent } from './vacantes/create-vacante/create-vacante.component';

const routes: Routes = [
  { path: 'club/perfil', component: ProfileClubComponent },
  { path: 'club/modify-profile', component: ModifyClubComponent },
  { path: 'club/crear-vacante', component: CreateVacanteComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubRoutingModule { }
