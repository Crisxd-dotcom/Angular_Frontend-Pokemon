import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  isMayorEdad: boolean = false;
  imagenPreview: string | null = null;
  nombreImagen: string | null = null;
  hobbies: string[] = [
    'Leer',
    'Jugar videojuegos',
    'Hacer ejercicio',
    'Cocinar',
    'Ver películas',
    'Pasear al aire libre',
    'Otro'
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    localStorage.removeItem('nombre');
    localStorage.removeItem('edad');
    localStorage.removeItem('numeroIdentidad');
    localStorage.removeItem('pasatiempo');
    localStorage.removeItem('fechaNacimiento');
    localStorage.removeItem('selectedPokemons');
    localStorage.removeItem('imagenPerfil');
    localStorage.removeItem('nombreImagen');
  
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      numeroIdentidad: [''],
      pasatiempo: ['']
    });
  
    const fechaNacimientoControl = this.registroForm.get('fechaNacimiento');
    if (fechaNacimientoControl) {
      fechaNacimientoControl.valueChanges.subscribe((fecha: string) => {
        if (fecha) {
          const edad = this.calcularEdad(fecha);
          this.isMayorEdad = edad >= 18;
  
          const numeroIdentidadControl = this.registroForm.get('numeroIdentidad');
          if (numeroIdentidadControl) {
            if (this.isMayorEdad) {              
              numeroIdentidadControl.setValidators([
                Validators.required,
                this.validarNumeroIdentidad.bind(this)
              ]);
            } else {              
              numeroIdentidadControl.clearValidators();
            }
            numeroIdentidadControl.updateValueAndValidity();
          }
        } else {
          this.isMayorEdad = false;
        }
      });
    }
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nombreImagen = file.name;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
        localStorage.setItem('imagenPerfil', this.imagenPreview!);
        localStorage.setItem('nombreImagen', this.nombreImagen!);
      };
      reader.readAsDataURL(file);
    }
  }
  

  calcularEdad(fechaNacimiento: string): number {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  formatNumeroIdentidad(value: string): string {
    return value.replace(/\D/g, '')
      .replace(/(\d{4})(\d{4})(\d{5})/, '$1-$2-$3');
  }

  onNumeroIdentidadChange(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length > 9) {
      value = value.slice(0, 9) + '-' + value.slice(9);
    }

    const numeroIdentidadControl = this.registroForm.get('numeroIdentidad');
    if (numeroIdentidadControl) {
      numeroIdentidadControl.setValue(value);
    }
  }

  validarNumeroIdentidad(control: any): { [key: string]: boolean } | null {
    const valor = control.value;
    if (valor && valor.length !== 15) {
      return { longitudInvalida: true };
    }
    return null;
  }
  

  onSubmit(): void {
    if (this.registroForm.valid) {
      const nombre = this.registroForm.value.nombre;
      const numeroIdentidad = this.registroForm.value.numeroIdentidad;
      const fechaNacimiento = this.registroForm.value.fechaNacimiento;
      const edad = this.calcularEdad(fechaNacimiento);
      const pasatiempo = this.registroForm.value.pasatiempo;

      
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('pasatiempo', pasatiempo);
      localStorage.setItem('fechaNacimiento',fechaNacimiento)
      localStorage.setItem('edad', edad.toString());
      localStorage.setItem('numeroIdentidad', this.isMayorEdad ? numeroIdentidad : 'No aplicable');

      this.router.navigate(['/inicio']);
    }
  }
}
