
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductoComponent } from './producto/producto.component';
import { ClienteComponent } from './cliente/cliente.component';
import { TurnoComponent } from './turno/turno.component';
import { VentaComponent } from './venta/venta.component';
import { CajaComponent } from './caja/caja.component';

const routes: Routes = [

    { 
        path: 'dashboard', 
        component: PagesComponent,
        children: [
            { path: '', component: DashboardComponent, data: { titulo: 'Dashboard'} },
            { path: 'productos', component: ProductoComponent, data: { titulo: 'Productos'} },
            { path: 'clientes', component: ClienteComponent, data: { titulo: 'Clientes'} },
            { path: 'turnos', component: TurnoComponent, data: { titulo: 'Turnos'} },
            { path: 'ventas', component: VentaComponent, data: { titulo: 'Ventas'} },
            { path: 'caja', component: CajaComponent, data: { titulo: 'Caja'} },
        ]
    }

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
