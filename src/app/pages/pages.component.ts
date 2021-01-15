import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor( private sideBarService: SidebarService) { }

  ngOnInit(): void {
    this.sideBarService.cargarMenu();
  }

}
