import { Component, computed, inject, input, OnInit, resource, Signal, signal } from '@angular/core';
import { Supaservice } from '../../services/supaservice';
import { Planta } from '../planta';
import { Registre } from '../registre';
import { RegistrePlantes } from '../registre-plantes/registre-plantes';

@Component({
  selector: 'app-plantes-detail',
  imports: [RegistrePlantes],
  templateUrl: './plantes-detail.html',
  styleUrl: './plantes-detail.css',
})
export class PlantesDetail{
  private supaservice: Supaservice = inject(Supaservice);
  
  id = input<string>();

  plantaResource = resource({
    params: () => ({ id: this.id() }),
    loader: ({ params }) => this.supaservice.getPlantaSupabaseById(Number(params.id))
  });

  planta = computed(() => {
    return this.plantaResource.hasValue() ? this.plantaResource.value() : null;
  });

  registrosResource = resource({
    params: () => ({ plantaId: this.id() }),
    loader: ({ params }) => this.supaservice.getRegistesSupabase(Number(params.plantaId))
  });

  registros: Signal<Registre[]> = computed(() => {
    return this.registrosResource.hasValue() ? this.registrosResource.value().map(r => {
      const date = new Date(r.created_at ? r.created_at : '');
      r.hour = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
      return r;
    }) : [];
  });


}