import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../club/navbar.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, NavbarComponent],  // Asegúrate de importar CommonModule aquí
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  selectedProfileType: string = '';
  filtros: any = {};

  // Posiciones y especialidades según el tipo
  futbolistaPositions: string[] = ['Portero', 'Defensa', 'Delantero', 'Mediocampista'];
  entrenadorEspecialidades: string[] = ['Primer Entrenador', 'Preparador Físico', 'Entrenador de Porteros'];
  clubCategorias: string[] = ['Primera División', 'Segunda División'];
  comunidades: string[] = ['Madrid', 'Cataluña', 'Andalucía'];

  constructor() {}

  ngOnInit(): void {}

  // Cambiar filtros según el tipo de perfil seleccionado
  onProfileTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;  // Casting explícito
    const value = target.value;  // Ahora 'value' está accesible
    this.selectedProfileType = value;
  }

  onFilterChange(filtro: string, valor: any): void {
    const target = valor.target as HTMLInputElement | HTMLSelectElement;  // Casting explícito
    const value = target.value;
    this.filtros[filtro] = value;
  }

  // Método de búsqueda que puedes modificar para hacer la llamada al backend
  buscar(): void {
    console.log('Buscando', this.selectedProfileType, 'con filtros:', this.filtros);
    // Lógica para buscar en el backend según el tipo y los filtros
  }
}
