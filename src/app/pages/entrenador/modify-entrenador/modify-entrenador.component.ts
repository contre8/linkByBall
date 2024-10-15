import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EntrenadorService } from '../../../service/entrenador/entrenador.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-entrenador',
  templateUrl: './modify-entrenador.component.html',
  styleUrls: ['./modify-entrenador.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class ModifyEntrenadorComponent implements OnInit {
  entrenadorForm!: FormGroup;
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto
  entrenador: any;
  clubs$: Observable<any[]> | undefined;
  selectedFile: File | null = null;
  selectedImageUrl: string | ArrayBuffer | null = null;
  isLoading: boolean = false;
  especialidades = [
    { label: 'Primer Entrenador', value: 'primer_entrenador' },
    { label: 'Segundo Entrenador', value: 'segundo_entrenador' },
    { label: 'Peparador Físico', value: 'preparador_fisico' },
    { label: 'Entrenador de Porteros', value: 'entrenador_porteros' },
    { label: 'Analista Táctico', value: 'analista' },
    { label: 'Fisioterapeuta', value: 'fisioterapeuta' },
    { label: 'Utillero', value: 'utillero' },
    { label: 'Nutricionista', value: 'nutricionista' },
    { label: 'Psicólogo Deportivo', value: 'psicologo' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private entrenadorService: EntrenadorService,  // Servicio de entrenador
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario con validaciones
    this.entrenadorForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.pattern('^[0-9]{9}$')],
      edad: ['', Validators.required],
      fotografia: [null],
      nacionalidad: ['', Validators.required],
      clubActual: [''],
      categoriaActual: [''],
      especialidades: this.fb.array([]),  // Campo para especialidades
      isContratado: [false]
    });

    this.authService.getEntrenadorProfile().subscribe(
      (entrenadorData) => {
        this.entrenador = entrenadorData;

        this.entrenadorForm = this.fb.group({
          nombre: [this.entrenador.nombre, Validators.required],
          apellidos: [this.entrenador.apellidos, Validators.required],
          edad: [this.entrenador.edad, [Validators.required, Validators.min(18)]],
          email: [{ value: this.entrenador.email, disabled: true }, [Validators.required, Validators.email]],
          telefono: [this.entrenador.telefono, [Validators.pattern('^[0-9]{9}$')]],
          clubActual: [this.entrenador?.clubActual?._id || '',],
          //categoriaActual: [{ value: this.entrenador.categoriaActual, disabled: true } || '',],
          categoriaActual: [{ value: this.entrenador.categoriaActual || '', disabled: true }],
          especialidades: [this.entrenador?.especialidades || [], Validators.required],
          isContratado: [this.entrenador.isContratado || false],
          nacionalidad: [this.entrenador.nacionalidad, Validators.required],
          fotografia: [null],  // Campo para la URL de la imagen de Cloudinary
        });
      },
      (error) => {
        console.error('Error al obtener el perfil del entrenador', error);
      }
    );

    this.clubs$ = this.authService.getClubs(); // Llama al servicio para obtener los clubes
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    this.isLoading = true;
    if (this.entrenadorForm.valid) {
      const formData = new FormData();

      // Añadir los campos del formulario a FormData
      formData.append('nombre', this.entrenadorForm.get('nombre')?.value);
      formData.append('apellidos', this.entrenadorForm.get('apellidos')?.value);
      formData.append('edad', this.entrenadorForm.get('edad')?.value);
      formData.append('telefono', this.entrenadorForm.get('telefono')?.value);
      formData.append('nacionalidad', this.entrenadorForm.get('nacionalidad')?.value);
      formData.append('isContratado', this.entrenadorForm.get('isContratado')?.value);

      const especialidades = this.entrenadorForm.get('especialidades')?.value;
      especialidades.forEach((especialidad: string, index: number) => {
        formData.append(`especialidades[${index}]`, especialidad);
      });

      // Añadir club y categoría si existen
      formData.append('clubActual', this.entrenadorForm.get('clubActual')?.value || '');
      formData.append('categoriaActual', this.entrenadorForm.get('categoriaActual')?.value || '');

      // Añadir la fotografía si existe
      if (this.selectedFile) {
        formData.append('fotografia', this.selectedFile);  // Usamos el archivo seleccionado
      }

      // Enviar el FormData al backend
      this.entrenadorService.updateEntrenadorProfile(formData).subscribe(response => {
        console.log('Perfil de entrenador actualizado', response);
        this.isLoading = false;
        // Redirigir al perfil
        this.router.navigate(['/entrenador/perfil'], { replaceUrl: true });
      });
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;

      // Crear la URL temporal para la vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result;
      };
      reader.readAsDataURL(file);

      console.log('Archivo seleccionado:', file);
    }
  }

  onClubChange() {
    const clubId = this.entrenadorForm.get('clubActual')?.value;
    if (clubId != "null") {
      this.authService.getClubCategory(clubId).subscribe(
        category => {
          this.entrenadorForm.get('categoriaActual')?.setValue(category.category);
          this.entrenador.clubActual = clubId;
          this.entrenador.categoriaActual = category.category;
        },
        error => {
          console.error('Error al obtener la categoría del club', error);
        }
      );
    } else {
      this.entrenadorForm.get('clubActual')?.setValue('');
      this.entrenadorForm.get('categoriaActual')?.setValue('');
      this.entrenador.clubActual = '';
      this.entrenador.categoriaActual = '';
    }
  }

  onCheckboxChange(event: any) {
    const selectedSpecialities = this.entrenadorForm.get('especialidades')?.value as string[];
    const value = event.target.value;

    if (event.target.checked) {
      // Añadir la especialidad seleccionada
      selectedSpecialities.push(value);
    } else {
      // Eliminar la especialidad si ya estaba seleccionada
      const index = selectedSpecialities.indexOf(value);
      if (index >= 0) {
        selectedSpecialities.splice(index, 1);
      }
    }

    // Actualizar el valor del campo "especialidades" en el formulario
    this.entrenadorForm.get('especialidades')?.setValue(selectedSpecialities);
  }
}
