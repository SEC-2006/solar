import { Component, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { PlantesItem } from "../plantes-item/plantes-item";
import { Planta } from '../planta';
import { PLANTES_DEMO } from '../plantes_demo';
import { JsonPipe } from '@angular/common';
import { Supaservice } from '../../services/supaservice';
import { Subscription } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-plantes-list',
  imports: [PlantesItem, JsonPipe],
  templateUrl: './plantes-list.html',
  styleUrl: './plantes-list.css',
})
export class PlantesList implements OnInit, OnDestroy{
  private supaservice: Supaservice = inject(Supaservice);

  plantes = toSignal(this.supaservice.plantesSubject);

  search = input('');

  constructor() {
    effect(() => {
      console.log("Search: ", this.search);
      this.supaservice.setSearchString(this.search());
    })
  }

  ngOnInit(): void {
      
      //this.supaservice.getPlantesSupabase().then((p: Planta[]) => this.plantes.set(p));
  }

  ngOnDestroy(): void {

  }


  toggleFavorite(planta: Planta) {
    planta.favorite = !planta.favorite;
  }
}
