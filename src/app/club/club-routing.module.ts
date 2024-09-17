import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileClubComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'club/perfil', component: ProfileClubComponent } // Declarar el standalone component
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubRoutingModule { }
