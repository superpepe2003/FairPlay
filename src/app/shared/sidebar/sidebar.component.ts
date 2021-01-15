import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {


  constructor( public sideBarService: SidebarService,
               public usuarioService: UsuarioService) {

  }

  ngOnInit(): void {

  }

  openItem( i ){
    this.sideBarService.menu[i].isOpen = !this.sideBarService.menu[i].isOpen;
  }

  logout() {
    this.usuarioService.logout();
  }

}
