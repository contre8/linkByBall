import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { FutbolistaRoutingModule } from './pages/futbolista/futbolista-routing.module';
import { EntrenadorRoutingModule } from './pages/entrenador/entrenador-routing.module';
import { ClubRoutingModule } from './pages/club/club-routing.module';
//import { LoginComponent } from './auth/login/login.component';
//import { UserSelectionComponent } from './auth/user-selection/user-selection.component';
//import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  // Aquí defines tus rutas, por ejemplo:
  //{ path: '', component: HomeComponent },
  //{ path: 'auth/login', component: LoginComponent },
  //{ path: 'auth/user-selection', component: UserSelectionComponent}
  //{ path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule,
    AuthRoutingModule,
    FutbolistaRoutingModule,
    EntrenadorRoutingModule,
    ClubRoutingModule
  ]
})
export class AppRoutingModule { }
