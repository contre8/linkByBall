import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http'; // Añadir provideHttpClient y withFetch
//import { RouterModule } from '@angular/router';
//import { appRoutes } from './app-routing.module';
import { AppRoutingModule } from './app-routing.module';  // Asegúrate de que el AppRoutingModule esté importado
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './service/auth/token.interceptor';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    //RouterModule.forRoot(appRoutes),
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideHttpClient(withFetch()) // Añadir esta línea para habilitar fetch API
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
