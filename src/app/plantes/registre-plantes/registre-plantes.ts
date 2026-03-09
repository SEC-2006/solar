import { Component, input } from '@angular/core';
import { Registre } from '../registre';

@Component({
  selector: '[app-registre-plantes]',
  imports: [],
  templateUrl: './registre-plantes.html',
  styleUrl: './registre-plantes.css',
})
export class RegistrePlantes {
    registro = input.required<Registre>({alias: 'registro'});
}
