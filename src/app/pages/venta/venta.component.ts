import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { fromEvent, Subscription, Observable } from 'rxjs';
import { BusquedasService } from '../../services/busquedas.service';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { Producto } from 'src/app/model/productos.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalListaTurnosComponent } from '../../components/modal-lista-turnos/modal-lista-turnos.component';
import * as moment from 'moment';
import { Turno } from '../../model/turnos.model';

import { TurnosVentas, ProductosVentas, Venta } from '../../model/ventas.model';
import { VentasService } from '../../services/ventas.service';
import Swal from 'sweetalert2';

class ProductosElegidos {

  constructor( public monto: number, 
               public producto: Producto, 
               public cantidad: number ) {}
}

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit, OnDestroy {

  //@ViewChild('txtTermino', { static: true }) txtTermino;
  
  sub$: Subscription; 
  productosElegidos: ProductosElegidos[] = [];
  turnosElegidos: Turno[] = [];
  productos: Producto[];
  total: number = 0;
  totalProductos: number = 0;
  totalTurnos: number = 0;

  constructor( private busquedasService: BusquedasService,
               private productosService: ProductosService,
               private modalService: NgbModal,
               private ventaService: VentasService) { }

  ngOnInit(): void {
    this.buscar();
  }

  ngOnDestroy() {
    if( this.sub$ ) {
      this.sub$.unsubscribe();
    }
  }

  buscar() {
    const txtTermino: any = document.getElementById('txtTermino');

    let bandera = true;

    const input$ = fromEvent<Event>( txtTermino, 'change').pipe(
      debounceTime(200),
      map( event => event.target['value'] ),
      switchMap( texto => this.productosService.buscarPorCodigo( texto ) )
    );
    this.sub$ = input$.subscribe( resp => {
      
      if ( resp.stock === 0 ) {
        Swal.fire('Error', 'No tienes Stock suficiente', 'error').then();
        return;
      }
      bandera = true;
      this.productosElegidos.map( r => {
        if( r.producto.codBarra == resp.codBarra ) {
          bandera = false;
          if( r.producto.stock >= (r.cantidad + 1)) {
            r.cantidad += 1;
            r.monto = r.producto.pVenta * r.cantidad;                      
            return r;
          } else {            
            Swal.fire('Error', 'No tienes Stock suficiente', 'error').then();
          }
        }
      });

      if ( bandera ) {
        const produElegido: ProductosElegidos = new ProductosElegidos( resp.pVenta, resp, 1 );
        this.productosElegidos.push( produElegido );
      }

      this.productosElegidos = this.productosElegidos.map( el => Object.assign( {}, el ));
      this.calcularTotales();
      txtTermino.value = '';

    });
  }

  incrementar( item: ProductosElegidos ) {

    if( item.producto.stock >= (item.cantidad + 1)) {
      item.cantidad += 1;
      item.monto = item.producto.pVenta * item.cantidad;
      this.productosElegidos = this.productosElegidos.map( el => Object.assign( {}, el ));
      this.calcularTotales();
    } else {
      Swal.fire('Error', 'No tienes Stock suficiente', 'error').then();
    }

  }

  decrementar( item: ProductosElegidos ) {
    item.cantidad -= 1;
    item.monto = item.producto.pVenta * item.cantidad;
    if( item.cantidad <= 0 ) {
      let index = this.productosElegidos.indexOf( item );
      this.productosElegidos.splice( index, 1);
    }
    this.productosElegidos = this.productosElegidos.map( el => Object.assign( {}, el ));
    this.calcularTotales();
  }

  calcularTotales(){
    this.totalProductos = 0;
    this.totalTurnos = 0;
    this.productosElegidos.forEach( r => {
      this.totalProductos += r.monto;
    });
    this.turnosElegidos.forEach( r => {
      this.totalTurnos = this.totalTurnos + r.precio;
    });

    this.total = this.totalProductos + this.totalTurnos;
  }

  // Cuando modifico el precio de algun Producto
  calcularProducto( item: ProductosElegidos, event) {
    item.producto.pVenta = Number(event.target.value);
    item.monto = item.producto.pVenta * item.cantidad;
    this.calcularTotales();
  }

  // CALCULA EL 
  calcularTurno( item: Turno, event ) {
    item.precio = Number(event.target.value);
    this.calcularTotales();
  }

  // ELIMINO 1 TURNO A COBRAR
  eliminarTurno( item: Turno) {
    let index = this.turnosElegidos.indexOf( item );
    this.turnosElegidos.splice( index, 1);
    this.calcularTotales();
  }

  // ABRO EL MODAL PARA ELEGIR LOS TURNOS A COBRAR
  abrirModal( ) {
    
    const modalRef = this.modalService.open(ModalListaTurnosComponent);

    modalRef.componentInstance.turnosYaCargados = this.turnosElegidos;

    modalRef.result.then( resp => {
      let bandera = false;
      this.turnosElegidos.map( r => {
        if( resp._id === r._id ) {
          bandera = true;
        }
      });
    
      if( !bandera) {
        this.turnosElegidos.push( resp );
        this.calcularTotales();
      }


    }, ( reason ) => {
    });

  }


  // GUARDO LA VENTA EN LA BASE DE DATOS
  Guardar() {
    // Tengo que transformar tanto los productos como los turnos al modelo aceptado de solo el id

    const turnosVenta: TurnosVentas[] = [];
    const productosVenta: ProductosVentas[] = [];
    this.turnosElegidos.forEach( resp => {
      turnosVenta.push( new TurnosVentas( resp.precio, resp._id ));
    });
    this.productosElegidos.forEach( resp => {
      productosVenta.push( new ProductosVentas( resp.cantidad, resp.monto, resp.producto._id ));
    });

    const venta = new Venta( moment(new Date(), 'YYYY-MM-DD').toDate(), this.total, productosVenta, turnosVenta );


    this.ventaService.crearVenta( venta ).subscribe( resp => {

      this.turnosElegidos = [];
      this.productosElegidos = [];
      this.totalProductos = 0;
      this.totalProductos = 0;
      this.total = 0;
        
      return;
    },
    error => Swal.fire('Error', 'La venta no se pudo guardar', 'error').then());

  }

}
