import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { PlantesList } from './plantes/plantes-list/plantes-list';
import { PlantesDetail } from './plantes/plantes-detail/plantes-detail';
import { PlantesTable } from './plantes/plantes-table/plantes-table';
import { AdministradorPlantes } from './plantes/administrador-plantes/administrador-plantes';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { userGuard } from './guards/user-guard-guard';

export const routes: Routes = [
     { path: 'home', component: Home },
     { path: 'plantes', canActivate: [userGuard], component: PlantesList },
     { path: 'plantes/:search', component: PlantesList },
     { path: 'plantes_table', component: PlantesTable },
     { path: 'planta/:id', component: PlantesDetail },
     { path: 'login', component: Login },
     { path: 'register', component: Register },
     { path: 'administrador', component: AdministradorPlantes },

     { path: '**', pathMatch: 'full', redirectTo: 'home' },

];
