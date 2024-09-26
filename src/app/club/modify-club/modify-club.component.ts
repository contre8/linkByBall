import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClubService } from '../club.service';  // Usa el servicio específico del club
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { COMUNIDADES_AUTONOMAS } from '../../const/comunidades.const';
import { PROVINCIAS_POR_COMUNIDAD } from '../../const/provincias.const';
import { DIVISIONES_FUTBOL_SENIOR } from '../../const/categorias.const';

@Component({
  selector: 'app-edit-club',
  templateUrl: './modify-club.component.html',
  styleUrls: ['./modify-club.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class ModifyClubComponent implements OnInit {
  clubForm!: FormGroup;
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto del club
  club: any;
  selectedFile: File | null = null;
  selectedImageUrl: string | ArrayBuffer | null = null;
  isLoading: boolean = false;
  comunidades = COMUNIDADES_AUTONOMAS;
  provincias: string[] = [];
  selectedComunidad: string = '';
  categorias = DIVISIONES_FUTBOL_SENIOR;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private clubService: ClubService,  // Inyectar el servicio del club
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Inicializar el formulario con validaciones
    this.clubForm = this.fb.group({
      nombre: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],  // Campo email deshabilitado
      telefono: ['', [Validators.pattern('^[0-9]{9}$')]],
      fotografia: [null],
      categoria: ['', Validators.required],
      comunidad: ['', Validators.required],
      provincia: ['', Validators.required],
      //password: ['', [Validators.required, Validators.minLength(6)]], // Validación para contraseña
      verificado: [false]
    });

    this.authService.getClubProfile().subscribe(
      (clubData) => {
        this.club = clubData;

        // Rellenar el formulario con los datos del club
        this.clubForm.patchValue({
          nombre: this.club.nombre,
          email: this.club.email,
          telefono: this.club.telefono,
          categoria: this.club.categoria,
          comunidad: this.club.comunidad,
          //provincia: this.club.provincia,
          verificado: this.club.verificado
        });
        // Cargar las provincias según la comunidad seleccionada
        this.loadProvincias(this.club.comunidad);
      },
      (error) => {
        console.error('Error al obtener el perfil del club', error);
      }
    );
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    this.isLoading = true;
    if (this.clubForm.valid) {
      const formData = new FormData();

      // Añadir los campos del formulario a FormData
      formData.append('nombre', this.clubForm.get('nombre')?.value);
      formData.append('email', this.clubForm.get('email')?.value);
      formData.append('telefono', this.clubForm.get('telefono')?.value || '');
      formData.append('categoria', this.clubForm.get('categoria')?.value);
      formData.append('comunidad', this.clubForm.get('comunidad')?.value);
      formData.append('provincia', this.clubForm.get('provincia')?.value);
      formData.append('verificado', this.clubForm.get('verificado')?.value ? 'true' : 'false');

      // Añadir la fotografía si existe
      if (this.selectedFile) {
        formData.append('fotografia', this.selectedFile);
      }

      // Verificar el contenido de FormData (opcional para depuración)
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      // Enviar el FormData al backend
      this.clubService.updateClubProfile(formData).subscribe(response => {
        console.log('Perfil del club actualizado', response);
        this.isLoading = false;
        // Redirigir al perfil del club
        this.router.navigate(['/club/perfil'], { replaceUrl: true });
      });
    }
  }

  // Manejar el cambio de imagen
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

  onComunidadChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const comunidad = target.value;

    // Obtener provincias y ordenarlas alfabéticamente
    this.provincias = (PROVINCIAS_POR_COMUNIDAD[comunidad] || []).sort((a, b) => a.localeCompare(b));
  }

  loadProvincias(comunidad: string): void {
    if (comunidad) {
      // Obtener las provincias según la comunidad seleccionada
      this.provincias = (PROVINCIAS_POR_COMUNIDAD[comunidad] || []).sort((a, b) => a.localeCompare(b));

      // Establecer la provincia seleccionada en el formulario, si existe
      if (this.club.provincia) {
        this.clubForm.patchValue({ provincia: this.club.provincia });
      }
    } else {
      this.provincias = []; // Si no hay comunidad, vaciar las provincias
      this.clubForm.patchValue({ provincia: '' }); // Resetear el campo de provincia
    }
  }

}
