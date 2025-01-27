import { UserSelectionComponent } from './user-selection/user-selection.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterFutbolistaComponent } from './register-futbolista/register-futbolista.component';
import { RegisterEntrenadorComponent } from './register-entrenador/register-entrenador.component';
import { RegisterClubComponent } from './register-club/register-club.component';
import { AuthGuard } from '../service/auth/auth.guard'; // Asegúrate de que la ruta sea correcta

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/user-selection', component: UserSelectionComponent},
  { path: 'auth/register/futbolista', component: RegisterFutbolistaComponent },
  { path: 'auth/register/entrenador', component: RegisterEntrenadorComponent },
  { path: 'auth/register/club', component: RegisterClubComponent },
];

// const routes: Routes = [
//   { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
//   { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
//   { path: 'login', component: LoginComponent },
//   { path: '**', redirectTo: '/login', pathMatch: 'full' } // Ruta por defecto
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
