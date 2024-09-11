import { UserSelectionComponent } from './user-selection/user-selection.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterFutbolistaComponent } from './register-futbolista/register-futbolista.component';
import { RegisterEntrenadorComponent } from './register-entrenador/register-entrenador.component';
import { RegisterClubComponent } from './register-club/register-club.component';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/user-selection', component: UserSelectionComponent},
  { path: 'auth/register/futbolista', component: RegisterFutbolistaComponent },
  { path: 'auth/register/entrenador', component: RegisterEntrenadorComponent },
  { path: 'auth/register/club', component: RegisterClubComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
