import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileEntrenadorComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'entrenador/perfil', component: ProfileEntrenadorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntrenadorRoutingModule { }
