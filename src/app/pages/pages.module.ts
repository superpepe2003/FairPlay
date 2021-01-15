import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductoComponent } from './producto/producto.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClienteComponent } from './cliente/cliente.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TurnoComponent } from './turno/turno.component';

import { NgSelect2Module } from 'ng-select2';
import { PipesModule } from '../pipes/pipes.module';
import { VentaComponent } from './venta/venta.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { BalancesComponent } from './balances/balances.component';
import { AuthGuard } from '../guards/auth.guard';
import { UsuarioComponent } from './usuario/usuario.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PagesComponent,
    ProductoComponent,
    ClienteComponent,
    TurnoComponent,
    VentaComponent,
    MovimientosComponent,
    BalancesComponent,
    UsuarioComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgSelect2Module,
    PipesModule
  ],
  exports: [
    DashboardComponent,
    ProductoComponent,
    PagesComponent
  ],
  providers: [
    AuthGuard
  ]
})
export class PagesModule { }
