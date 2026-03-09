import { Component, signal, Signal } from '@angular/core';
import { PlantesTable } from '../plantes-table/plantes-table';
import { Planta } from '../planta';
import { AdministradorPlantesFormulari } from '../administrador-plantes-formulari/administrador-plantes-formulari';

@Component({
  selector: 'app-administrador-plantes',
  imports: [PlantesTable, AdministradorPlantesFormulari],
  templateUrl: './administrador-plantes.html',
  styleUrl: './administrador-plantes.css',
})
export class AdministradorPlantes {

  onAction(event: {action: 'editar' | 'eliminar', planta: any}) {
    console.log('Acción recibida en AdministradorPlantes:', event);
    this.currentPlanta.set(event.planta);
  }

  currentPlanta = signal<Planta>({} as Planta);

  nuevaPlanta() {
    this.currentPlanta.set({} as Planta);
  }

}
