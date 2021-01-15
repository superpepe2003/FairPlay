import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ClientesService } from 'src/app/services/clientes.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../model/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { ModalUsuarioComponent } from '../../components/modal-usuario/modal-usuario.component';
import { CargarUsuarios } from '../../interfaces/cargar-usuarios.interface';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: [
  ]
})
export class UsuarioComponent implements OnInit {

  formSubmitted = false;

  // lista de usuarios de la base de datos
  usuarios: Usuario[] = [];
  // lista de clientes copia de la base de datos por si aplica filtro y quiere volver
  usuarioTemp: Usuario[] = [];

  sub$: Subscription;
  totalUsuarios = 0;
  desde = 0;
  cargando = true;

  constructor(  private modalService: NgbModal,
                private usuarioService: UsuarioService,
                private usuarioSearch: BusquedasService ) { }

  ngOnInit(): void {
    this.cargaUsuarios();
  }

  cargaUsuarios() {
    this.cargando = true;
    this.sub$ = this.usuarioService.cargarUsuarios( this.desde )
        .subscribe( ({ usuarios, total }) => {
          this.usuarios = usuarios;
          this.totalUsuarios = total;
          this.usuarioTemp = usuarios;
          this.cargando = false;
        });
  }

  cambiarPagina( desde: number ) {
    this.desde += desde;
    if( this.desde < 0 ) {
      this.desde = 0;
      return;
    } else if ( this.desde >= this.totalUsuarios ) {
      this.desde -= desde;
      return;
    }
    this.cargaUsuarios();
  }

  buscar( termino: string ) {
    if ( termino.length === 0 ) {
      return this.usuarios = this.usuarioTemp;
    }
    this.sub$ = this.usuarioSearch.buscar('usuarios', termino)
        .subscribe((resp: any) => {
          this.usuarios = resp;
        });
  }

  abrirModal( usuario: Usuario = null ) {
    
    const modalref = this.modalService.open( ModalUsuarioComponent );

    if( usuario ) {
      modalref.componentInstance.usuario = usuario;
      modalref.componentInstance.isModificar = true;
    }

    modalref.result.then( resp => {
      if( resp === true) {
        this.cargaUsuarios();
      }
    }, ( reason ) => {
      if( reason === true ) {
        this.cargaUsuarios();
      }
    })
  }

  deleteCliente( item: Usuario ) {
    Swal.fire({
      title: '¿Borrar Cliente?',
      text: `Esta a punto de borrar ${ item.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.eliminarUsuario( item._id )
          .subscribe( resp => {
            Swal.fire(
              'Usuario borrado!',
              `${ item.nombre } fue elimnado correctamente`,
              'success');
            this.cargaUsuarios();
            });

      }
    });
  }

  ngOnDestroy() {
    if( this.sub$ ) {
      this.sub$.unsubscribe();
    }
  }


}
