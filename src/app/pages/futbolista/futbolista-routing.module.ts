import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ModifyFutbolistaComponent } from './modify-futbolista/modify-futbolista.component';
import { ExternalProfileComponent } from './external-profile/external-profile.component';

const routes: Routes = [
  { path: 'futbolista/perfil', component: ProfileComponent },
  { path: 'futbolista/modify-profile', component: ModifyFutbolistaComponent },
  { path: 'futbolista/perfil/:id', component: ExternalProfileComponent } // Ruta para visualizar un perfil específico de futbolista
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FutbolistaRoutingModule { }
