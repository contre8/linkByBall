import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ModifyFutbolistaComponent } from './modify-futbolista/modify-futbolista.component';

const routes: Routes = [
  { path: 'futbolista/perfil', component: ProfileComponent },
  { path: 'futbolista/modify-profile', component: ModifyFutbolistaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FutbolistaRoutingModule { }
