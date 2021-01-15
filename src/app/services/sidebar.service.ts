import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu = [];

  constructor() {}

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')) || [];
    // if( this.menu.length )
  }

}
