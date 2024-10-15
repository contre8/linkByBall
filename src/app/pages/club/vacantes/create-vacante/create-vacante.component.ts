import { ClubService } from './../../../../service/club/club.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../../auth/auth.service';
import { NavbarComponent } from '../../../navbar/navbar.component';

@Component({
  selector: 'app-create-vacante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, NavbarComponent],
  templateUrl: './create-vacante.component.html',
  styleUrls: ['./create-vacante.component.scss']
})
export class CreateVacanteComponent implements OnInit {
  vacanteForm!: FormGroup;
  positions: string[] = [];
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
  club: any;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clubService: ClubService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario sin el ID del club por defecto
    this.vacanteForm = this.fb.group({
      club: ['', Validators.required], // Campo club que será asignado después de obtener el perfil
      posicion: [{ value: '', disabled: true }, Validators.required],
      destinatario: ['', Validators.required],
      descripcion: [''],
      salario: ['', [Validators.min(0)]]
    });

    // Obtener los datos del club y luego asignar el ID del club al formulario
    this.authService.getClubProfile().subscribe(
      (clubData) => {
        this.club = clubData;
        if (this.club && this.club._id) {
          this.vacanteForm.patchValue({ club: this.club._id });
          console.log(`Club ID asignado: ${this.club._id}`);
        }
      },
      (error) => {
        console.error('Error al obtener el perfil del club', error);
      }
    );
  }

  // Método para manejar el cambio de destinatario
  onDestinatarioChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const destinatario = target.value;

    // Actualizar las opciones de posición según el destinatario seleccionado
    if (destinatario === 'Futbolista') {
      this.positions = this.allPositions.futbolista;
    } else if (destinatario === 'Entrenador') {
      this.positions = this.allPositions.entrenador;
    } else {
      this.positions = [];
    }

    // Habilitar el campo de posición
    if (this.positions.length > 0) {
      this.vacanteForm.get('posicion')?.enable();
    } else {
      this.vacanteForm.get('posicion')?.disable();
    }

    // Resetear el valor del campo posición
    this.vacanteForm.patchValue({ posicion: '' });
  }

  onSubmit(): void {
    if (this.vacanteForm.valid) {
      this.isLoading = true;
      this.clubService.createVacante(this.vacanteForm.value).subscribe(
        (response) => {
          console.log('Vacante creada exitosamente', response);
          this.isLoading = false;
          this.router.navigate(['/club/vacantes-dashboard']); // Redirige a la página deseada
        },
        (error) => {
          console.error('Error al crear la vacante', error);
        }
      );
    }
  }
}

