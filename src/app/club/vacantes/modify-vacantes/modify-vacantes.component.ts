import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClubService } from '../../club.service';
import { AuthService } from '../../../auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../../navbar/navbar.component';

@Component({
  selector: 'app-modify-vacante',
  templateUrl: './modify-vacantes.component.html',
  styleUrls: ['./modify-vacantes.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatProgressSpinnerModule, NavbarComponent]
})
export class ModifyVacantesComponent implements OnInit {
  vacanteForm!: FormGroup;
  positions: string[] = []; // Lista de posiciones que dependerá del destinatario
  allPositions = {
    futbolista: [
      'Portero', 'Central Diestro', 'Central Zurdo', 'Lateral Diestro', 'Lateral Zurdo',
      'Mediocentro Defensivo', 'Interior Diestro', 'Interior Zurdo', 'Mediapunta',
      'Extremo Diestro', 'Extremo Zurdo', 'Delantero Centro', 'Carrilero Diestro', 'Carrilero Zurdo'
    ],
    entrenador: [
      'Primer Entrenador', 'Segundo Entrenador', 'Preparador Físico', 'Entrenador de Porteros',
      'Analista Táctico', 'Fisioterapeuta', 'Utillero', 'Nutricionista', 'Psicólogo Deportivo'
    ]
  };
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clubService: ClubService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario de la vacante
    this.vacanteForm = this.fb.group({
      destinatario: [{ value: '', disabled: true }, Validators.required],
      posicion: [{ value: '', disabled: true }, Validators.required],
      salario: ['', [Validators.min(0)]],
      descripcion: ['']
    });

    // Obtener el ID de la vacante de la URL
    const vacanteId = this.route.snapshot.paramMap.get('id');
    console.log(vacanteId)
    if (vacanteId) {
      this.isLoading = true;
      this.clubService.getVacanteById(vacanteId).subscribe(
        (vacante) => {
          console.log(vacante)
          // Configurar las posiciones según el destinatario
          this.setPositionsByDestinatario(vacante.destinatario);

          // Rellenar el formulario con los datos de la vacante
          this.vacanteForm.patchValue({
            destinatario: vacante.destinatario,
            posicion: vacante.posicion,
            salario: vacante.salario,
            descripcion: vacante.descripcion
          });
          this.isLoading = false;
        },
        (error) => {
          console.error('Error al obtener la vacante', error);
          this.isLoading = false;
        }
      );
    }
  }

  setPositionsByDestinatario(destinatario: string): void {
    if (destinatario === 'Futbolista') {
      this.positions = this.allPositions.futbolista;
    } else if (destinatario === 'Entrenador') {
      this.positions = this.allPositions.entrenador;
    } else {
      this.positions = [];
    }
  }

  onSubmit(): void {
    if (this.vacanteForm.valid) {
      this.isLoading = true;
      const vacanteId = this.route.snapshot.paramMap.get('id');
      this.clubService.updateVacante(vacanteId!, this.vacanteForm.getRawValue()).subscribe(
        (response) => {
          console.log('Vacante modificada exitosamente', response);
          this.isLoading = false;
          this.router.navigate(['/club/vacantes-dashboard']); // Redirige al dashboard después de actualizar
        },
        (error) => {
          console.error('Error al modificar la vacante', error);
          this.isLoading = false;
        }
      );
    }
  }
}
