import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {
  nombre: string = '';
  edad : number = 0;
  fechaNacimiento: string =' '; 
  numeroIdentidad : string = '';
  selectedPokemons: any[] = [];
  showRegisterMessage: boolean = false; 

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre') || 'Invitado';
    this.edad = parseInt(localStorage.getItem('edad') || '0', 10);
    this.fechaNacimiento = localStorage.getItem('fechaNacimiento') || '00-00-0000';
    this.numeroIdentidad = localStorage.getItem('numeroIdentidad') || '';
  
    if (!this.nombre || !this.edad || this.edad <= 0 || this.nombre === '') {
      this.showRegisterMessage = true;
    } else {
      this.showRegisterMessage = false;
    }
  
    const selectedPokemonsData = localStorage.getItem('selectedPokemons');
    if (selectedPokemonsData) {
      this.selectedPokemons = JSON.parse(selectedPokemonsData);
    } else {
      this.selectedPokemons = [];
    }
  }
  
  
  

  goBackToInicio(): void {
    localStorage.setItem('nombre', this.nombre);
    localStorage.setItem('edad', this.edad.toString());
    localStorage.setItem('selectedPokemons', JSON.stringify(this.selectedPokemons));
    
    this.router.navigate(['/inicio']);
  }

  goEditarPerfil(): void {
    localStorage.setItem('nombre', this.nombre);
    localStorage.setItem('edad', this.edad.toString());
    localStorage.setItem('selectedPokemons', JSON.stringify(this.selectedPokemons));
    localStorage.setItem('fechaNacimiento',this.fechaNacimiento);
    
    this.router.navigate(['/editar']);
  }
}
