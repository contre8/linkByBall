import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileEntrenadorComponent } from './profile/profile.component';
import { ModifyEntrenadorComponent } from './modify-entrenador/modify-entrenador.component';
import { ExternalProfileComponent } from './external-profile/external-profile.component';
import { FavoritosComponent } from '../favoritos/favoritos.component';

const routes: Routes = [
  { path: 'entrenador/perfil', component: ProfileEntrenadorComponent },
  { path: 'entrenador/modify-profile', component: ModifyEntrenadorComponent },
  { path: 'entrenador/perfil/:id', component: ExternalProfileComponent },
  { path: 'futbolista/favoritos', component: FavoritosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntrenadorRoutingModule { }
