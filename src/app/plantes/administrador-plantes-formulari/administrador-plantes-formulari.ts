import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { Planta } from '../planta';
import { form, FormField, min, minLength, required } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';
import { Supaservice } from '../../services/supaservice';

type PlantaFormModel = Omit<Planta, 'foto'> & { foto: string };

@Component({
  selector: 'app-administrador-plantes-formulari',
  imports: [FormField, JsonPipe],
  templateUrl: './administrador-plantes-formulari.html',
  styleUrl: './administrador-plantes-formulari.css',
})
export class AdministradorPlantesFormulari {

  planta = input.required<Planta>();
  supaservice = inject(Supaservice);

  isEditing = computed(() => !!this.planta()?.id);

  plantaModel = linkedSignal<PlantaFormModel>(() => {
    const p = this.planta();
    return {
      id: p?.id ?? 0,
      created_at: p?.created_at ?? 0,
      nom: p?.nom ?? '',
      ubicacio: p?.ubicacio ?? { latitude: 0, longitude: 0 },
      capacitat: p?.capacitat ?? 0,
      user: p?.user ?? '',
      foto: p?.foto ?? '',
      favorite: p?.favorite ?? false,
    };
  });

  plantaForm = form(this.plantaModel, (schemaPath) => {
    required(schemaPath.nom, { message: 'Nom is required' });
    minLength(schemaPath.nom, 10, { message: 'Nom has to be min 10 characters long' });
    min(schemaPath.capacitat, 1000, { message: 'Capacitat has to be min 1000' });
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(file);
    }
  }

  async onCreate() {
    await this.supaservice.createPlanta(this.plantaModel());
  }

  async onUpdate() {
    console.log('plantaModel antes de update:', this.plantaModel());
    await this.supaservice.updatePlanta(this.plantaModel());
  }
}