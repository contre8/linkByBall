import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
//import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  // Aquí defines tus rutas, por ejemplo:
  //{ path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  //{ path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
