import { Component, input, output } from '@angular/core';
import { Planta } from '../planta';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-plantes-item',
  imports: [RouterLink],
  templateUrl: './plantes-item.html',
  styleUrl: './plantes-item.css',
})
export class PlantesItem {
  planta = input.required<Planta>({alias: 'plantaId'});

  favoriteToggled = output<void>();

  toggleFavorite() {
    this.favoriteToggled.emit();
    //this.planta().favorite = !this.planta().favorite;
  }
}
