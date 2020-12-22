import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Cliente } from '../../model/clientes.model';
import { ClientesService } from '../../services/clientes.service';
import { BusquedasService } from '../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalClienteComponent } from '../../components/modal-cliente/modal-cliente.component';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit, OnDestroy {

  formSubmitted = false;

  // lista de clientes de la base de datos
  clientes: Cliente[] = [];
  // lista de clientes copia de la base de datos por si aplica filtro y quiere volver
  clientesTemp: Cliente[] = [];

  clientesSub$: Subscription[] = [];
  totalClientes = 0;
  desde = 0;
  cargando = true;

  constructor(  private modalService: NgbModal,
                private clienteService: ClientesService,
                private clienteSearch: BusquedasService ) { }

  ngOnInit(): void {
    this.cargaClientes();
  }

  cargaClientes() {
    this.cargando = true;
    this.clientesSub$.push( this.clienteService.cargarClientes( this.desde )
        .subscribe( ({ clientes, total }) => {
          this.clientes = clientes;
          this.totalClientes = total;
          this.clientesTemp = clientes;
          this.cargando = false;
        })
    );
  }

  cambiarPagina( desde: number ) {
    this.desde += desde;
    if( this.desde < 0 ) {
      this.desde = 0;
      return;
    } else if ( this.desde >= this.totalClientes ) {
      this.desde -= desde;
      return;
    }
    this.cargaClientes();
  }

  buscar( termino: string ) {
    if ( termino.length === 0 ) {
      return this.clientes = this.clientesTemp;
    }
    this.clientesSub$.push( this.clienteSearch.buscar('clientes', termino)
        .subscribe((resp: any) => {
          this.clientes = resp;
        })
    );
  }

  abrirModal( cliente: Cliente = null ) {
    
    const modalref = this.modalService.open( ModalClienteComponent );

    if( cliente ) {
      modalref.componentInstance.cliente = cliente;
      modalref.componentInstance.isModificar = true;
    }

    modalref.result.then( resp => {
      if( resp === true) {
        this.cargaClientes();
      }
    }, ( reason ) => {
      if( reason === true ) {
        this.cargaClientes();
      }
    })
  }

  deleteCliente( item: Cliente ) {
    Swal.fire({
      title: '¿Borrar Cliente?',
      text: `Esta a punto de borrar ${ item.nombreCompleto }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.clienteService.eliminarCliente( item._id )
          .subscribe( resp => {
            Swal.fire(
              'Cliente borrado!',
              `${ item.nombreCompleto } fue elimnado correctamente`,
              'success');
            this.cargaClientes();
            });

      }
    });
  }

  ngOnDestroy() {
    this.clientesSub$.forEach( resp => resp.unsubscribe());
    this.clientesSub$ = [];
  }


  ///////////////////////////////////////////
  /// MODAL FUNCIONES                     ///
  //////////////////////////////////////////

}
