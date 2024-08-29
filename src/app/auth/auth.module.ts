import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';  // <-- Importa FormsModule
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    //LoginComponent
  ],
  imports: [
    LoginComponent,
    CommonModule,
    ReactiveFormsModule,
    //FormsModule,  // <-- Asegúrate de que FormsModule esté aquí
    AuthRoutingModule
  ]
})
export class AuthModule { }
