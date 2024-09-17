import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileEntrenadorComponent } from './profile/profile.component';
import { EntrenadorRoutingModule } from './entrenador-routing.module';


@NgModule({
  declarations: [
    ProfileEntrenadorComponent
  ],
  imports: [
    CommonModule,
    EntrenadorRoutingModule
  ]
})
export class EntrenadorModule { }
