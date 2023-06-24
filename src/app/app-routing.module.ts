import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { ProdGuardService as guard } from './guards/prod-guard.service';
import { MenuComponent } from './menu/menu.component';
import { CalculatorComponent } from './pages/calculator/calculator.component';
import { CronogramaComponent } from './pages/cronograma/cronograma.component';
import { HistorialComponent } from './pages/historial/historial.component';


const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full'},
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegistroComponent },
  { path: 'menu', component: MenuComponent},
  { path: 'calculator', component: CalculatorComponent},
  { path: 'cronograma', component: CronogramaComponent},
  { path: 'historial', component: HistorialComponent, canActivate: [guard], data: { expectedRol: ['admin'] } }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
