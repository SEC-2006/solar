import { Component, input, output } from '@angular/core';
import { Planta } from '../planta';

@Component({
  selector: '[app-plantes-table-row]',
  imports: [],
  templateUrl: './plantes-table-row.html',
  styleUrl: './plantes-table-row.css',
})
export class PlantesTableRow {
  planta = input.required<Planta>({alias: 'plantaId'});
  action = output<{action: 'editar' | 'eliminar', planta: Planta}>();
  editar() {
    this.action.emit({action: 'editar', planta: this.planta()});
  }
  eliminar() {
    this.action.emit({action: 'eliminar', planta: this.planta()});
  }
}
