import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { FutbolistaRoutingModule } from './pages/futbolista/futbolista-routing.module';
import { EntrenadorRoutingModule } from './pages/entrenador/entrenador-routing.module';
import { ClubRoutingModule } from './pages/club/club-routing.module';
import { AdminRoutingModule } from './pages/admin/admin-routing.module';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule,
    AuthRoutingModule,
    FutbolistaRoutingModule,
    EntrenadorRoutingModule,
    ClubRoutingModule,
    AdminRoutingModule
  ]
})
export class AppRoutingModule { }
