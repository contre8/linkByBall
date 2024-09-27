import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileClubComponent } from './profile/profile.component';
import { ModifyClubComponent } from './modify-club/modify-club.component';

const routes: Routes = [
  { path: 'club/perfil', component: ProfileClubComponent },
  { path: 'club/modify-profile', component: ModifyClubComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubRoutingModule { }
