
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductoComponent } from './producto/producto.component';
import { ClienteComponent } from './cliente/cliente.component';
import { TurnoComponent } from './turno/turno.component';
import { VentaComponent } from './venta/venta.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { BalancesComponent } from './balances/balances.component';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { UsuarioComponent } from './usuario/usuario.component';

const routes: Routes = [

    { 
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardComponent, data: { titulo: 'Bienvenido'} },
            { path: 'productos', component: ProductoComponent, data: { titulo: 'Productos'} },
            { path: 'clientes', component: ClienteComponent, data: { titulo: 'Clientes'} },
            { path: 'turnos', component: TurnoComponent, data: { titulo: 'Turnos'} },
            { path: 'ventas', component: VentaComponent, data: { titulo: 'Ventas'} },

            // RUTAS ADMIN

            { path: 'movimiento', canActivate: [AdminGuard], component: MovimientosComponent, data: { titulo: 'Movimientos'} },
            { path: 'balance', canActivate: [AdminGuard], component: BalancesComponent, data: { titulo: 'Balance'} },
            { path: 'usuario', canActivate: [AdminGuard], component: UsuarioComponent, data: { titulo: 'Usuarios'} },
        ]
    },
    // {
    //     path: 'administracion',
    //     component: PagesComponent,
    //     canActivate: [ AuthGuard, AdminGuard ],
    //     children: [
    //         { path: 'movimiento', component: MovimientosComponent, data: { titulo: 'Movimiento'} },
    //         { path: 'balance', component: BalancesComponent, data: { titulo: 'Balance'} },
    //     ]
    // }

    // { path: 'path/:routeParam', component: MyComponent },
    // { path: 'staticPath', component: ... },
    // { path: '**', component: ... },
    // { path: 'oldPath', redirectTo: '/staticPath' },
    // { path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
