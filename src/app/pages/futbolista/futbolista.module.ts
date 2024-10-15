import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FutbolistaRoutingModule } from './futbolista-routing.module';  // Importa el routing module

@NgModule({
  imports: [
    CommonModule,
    FutbolistaRoutingModule  // Importa las rutas, incluyendo el componente standalone
  ]
})
export class FutbolistaModule { }
