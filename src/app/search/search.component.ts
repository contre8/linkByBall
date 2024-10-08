import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../club/navbar.component';
import { DIVISIONES_FUTBOL_SENIOR } from '../const/categorias.const' ;
import { COMUNIDADES_AUTONOMAS } from '../const/comunidades.const' ;
import { ESPECIALIDADES_ENTRENADOR } from '../const/especialidades-entrenador.const' ;
import { PROVINCIAS_POR_COMUNIDAD } from '../const/provincias.const' ;
import { POSICIONES_FUTBOLISTAS } from '../const/posiciones-futbolista.const';
import { SearchService } from '../service/search/search.service';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, NavbarComponent], // Asegúrate de importar CommonModule aquí
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  selectedProfileType: string = '';
  filtros: any = {};
  
  // Posiciones y especialidades según el tipo
  futbolistaPositions = POSICIONES_FUTBOLISTAS;
  entrenadorEspecialidades = ESPECIALIDADES_ENTRENADOR;
  clubCategorias: string[] = DIVISIONES_FUTBOL_SENIOR;
  comunidades: string[] = COMUNIDADES_AUTONOMAS;
  provincias: string[] = [];
  resultados: any[] = [];

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    //this.entrenadorEspecialidades = Object.values(ESPECIALIDADES_ENTRENADOR); // Convertir el objeto a una lista
  }

  // Cambiar filtros según el tipo de perfil seleccionado
  onProfileTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedProfileType = target.value;

    // Reiniciar filtros cada vez que cambie el tipo de perfil
    this.filtros = {};
  }

  // Método para obtener los valores de ESPECIALIDADES_ENTRENADOR
  getEspecialidadesKeys(): Array<keyof typeof ESPECIALIDADES_ENTRENADOR> {
    return Object.keys(this.entrenadorEspecialidades) as Array<keyof typeof ESPECIALIDADES_ENTRENADOR>;
  }

  // Filtrar provincias por comunidad seleccionada
  onComunidadChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const comunidadSeleccionada = target.value;
    this.provincias = PROVINCIAS_POR_COMUNIDAD[comunidadSeleccionada] || [];
    this.filtros['provincia'] = ''; // Reinicia la provincia cuando se cambia la comunidad
  }

  onFilterChange(filtro: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const value = target.value;
    
    // Guardar el filtro en el objeto `filtros`
    this.filtros[filtro] = value;
  
    console.log(`Filtro aplicado: ${filtro}, Valor: ${value}`);
  }

  buscar(): void {
    this.searchService.applyFilters(this.selectedProfileType, this.filtros).subscribe(
      (resultados) => {
        this.resultados = resultados;
        console.log('Resultados de la búsqueda:', resultados);
      },
      (error) => {
        console.error('Error en la búsqueda:', error);
      }
    );
  }
  
}
