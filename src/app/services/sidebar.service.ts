import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Main', url: '/', icono: 'fas fa-home'},
        { titulo: 'Clientes', url: 'clientes', icono: 'fas fa-user-friends'},
        { titulo: 'Productos', url: 'productos', icono: 'fab fa-product-hunt'},
        { titulo: 'Turnos', url: 'turnos', icono: 'fas fa-futbol'},
        { titulo: 'Ventas', url: 'ventas', icono: 'fab fa-sellcast'},
        { titulo: 'Caja', url: 'caja', icono: 'fab fa-sellcast'},
      ]
    }
  ];

  constructor() {}
}
