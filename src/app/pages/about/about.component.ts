import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="about-container">
      <div class="about-content">
        <h1>LinkByBall</h1>
        <h2>Información del Proyecto</h2>

        <div class="author-info">
          <h3>Autor</h3>
          <p>Adrián Contreras Sanz</p>
          <p>Trabajo Fin de Grado</p>
          <p>Universidad de Valladolid</p>
          <p>2024/2025</p>
        </div>

        <div class="project-info">
          <h3>Descripción</h3>
          <p>LinkByBall es una plataforma web que conecta a futbolistas, entrenadores y clubes de fútbol,
             facilitando la búsqueda de oportunidades deportivas y el networking en el mundo del fútbol.</p>
        </div>

        <div class="copyright">
          <p>© 2024 LinkByBall - Todos los derechos reservados</p>
          <p>Este proyecto está protegido por derechos de autor.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 2rem;
      background-color: #f5f5f5;
    }

    .about-content {
      max-width: 800px;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h1 {
      color: #1976d2;
      text-align: center;
      margin-bottom: 1rem;
    }

    h2 {
      color: #333;
      text-align: center;
      margin-bottom: 2rem;
    }

    .author-info, .project-info, .copyright {
      margin-bottom: 2rem;
    }

    h3 {
      color: #1976d2;
      margin-bottom: 1rem;
    }

    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 0.5rem;
    }

    .copyright {
      text-align: center;
      border-top: 1px solid #eee;
      padding-top: 1rem;
      margin-top: 2rem;
    }

    .copyright p {
      font-size: 0.9rem;
      color: #888;
    }
  `]
})
export class AboutComponent {}
