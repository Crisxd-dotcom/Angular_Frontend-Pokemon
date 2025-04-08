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
  pasatiempo: string = '';
  numeroIdentidad : string = '';
  selectedPokemons: any[] = [];
  showRegisterMessage: boolean = false; 
  imagenPerfil: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre') || 'Invitado';
    this.pasatiempo = localStorage.getItem('pasatiempo') || '';
    this.edad = parseInt(localStorage.getItem('edad') || '0', 10);
    this.fechaNacimiento = localStorage.getItem('fechaNacimiento') || '00-00-0000';
    this.numeroIdentidad = localStorage.getItem('numeroIdentidad') || '';
    this.imagenPerfil = localStorage.getItem('imagenPerfil') || 'https://via.placeholder.com/160';


    
  
    if (!this.nombre || !this.edad || this.edad <= 0 || this.nombre === ''|| this.pasatiempo === '') {
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

  getStatWidth(pokemon: any, statName: string): string {
    const statObj = pokemon.stats.find((s: any) =>
      (s.stat && s.stat.name === statName) || (s.name === statName)
    );
    if (!statObj) return '0%';
  
    const baseStat = (typeof statObj.base_stat !== 'undefined') ? statObj.base_stat : statObj.base;
  
    const maxValues: { [key: string]: number } = {
      'hp': 255,
      'attack': 190,
      'defense': 230,
      'special-attack': 194,
      'special-defense': 230,
      'speed': 180
    };
  
    const max = maxValues[statName] || 255;
    const percent = Math.floor((baseStat / max) * 100);
    return `${percent}%`;
  }
  
  getStatValue(pokemon: any, statName: string): number {
    const statObj = pokemon.stats.find(function(s: any) {
      return (s.stat && s.stat.name === statName) || (s.name === statName);
    });
  
    if (!statObj) return 0;
  
    if (typeof statObj.base_stat !== 'undefined') {
      return statObj.base_stat;
    } else if (typeof statObj.base !== 'undefined') {
      return statObj.base;
    }
  
    return 0;
  }
  
  
  
  
  

  goBackToInicio(): void {
    localStorage.setItem('nombre', this.nombre);
    localStorage.setItem('pasatiempo', this.pasatiempo);
    localStorage.setItem('edad', this.edad.toString());
    localStorage.setItem('selectedPokemons', JSON.stringify(this.selectedPokemons));
    
    this.router.navigate(['/inicio']);
  }

  goEditarPerfil(): void {
    localStorage.setItem('nombre', this.nombre);
    localStorage.setItem('pasatiempo', this.pasatiempo);
    localStorage.setItem('edad', this.edad.toString());
    localStorage.setItem('selectedPokemons', JSON.stringify(this.selectedPokemons));
    localStorage.setItem('fechaNacimiento',this.fechaNacimiento);
    
    this.router.navigate(['/editar']);
  }
}
