import { Component, inject, output, signal } from '@angular/core';
import { PLANTES_DEMO } from '../plantes_demo';
import { Planta } from '../planta';
import { PlantesTableRow } from "../plantes-table-row/plantes-table-row";
import { Supaservice } from '../../services/supaservice';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-plantes-table',
  imports: [PlantesTableRow],
  templateUrl: './plantes-table.html',
  styleUrl: './plantes-table.css',
})
export class PlantesTable {
  private supaservice: Supaservice = inject(Supaservice);
  plantes = toSignal(this.supaservice.plantesSubject);
  
  action = output<{action: 'editar' | 'eliminar', planta: Planta}>();

  onAction(event: {action: 'editar' | 'eliminar', planta: Planta}) {
    this.action.emit(event);
  }
}
