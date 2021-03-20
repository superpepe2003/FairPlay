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
import { ProductosCompras, Compra } from '../../model/compras.model';
import { ComprasService } from '../../services/compras.service';

class ProductosElegidos {

  constructor( public monto: number, 
                public producto: Producto, 
                public cantidad: number ) {}
}

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit, OnDestroy {

  sub$: Subscription; 
  productosElegidos: ProductosElegidos[] = [];
  productos: Producto[];
  total: number = 0;
  totalProductos: number = 0;

  constructor( private busquedasService: BusquedasService,
                private productosService: ProductosService,
                private modalService: NgbModal,
                private comprasService: ComprasService) { }

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
      
      bandera = true;
      this.productosElegidos.map( r => {
        if( r.producto.codBarra == resp.codBarra ) {
          bandera = false;          
          r.cantidad += 1;
          r.monto = r.producto.pCompra * r.cantidad;                      
          return r;
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

      item.cantidad += 1;
      item.monto = item.producto.pCompra * item.cantidad;
      this.productosElegidos = this.productosElegidos.map( el => Object.assign( {}, el ));
      this.calcularTotales();

  }

  decrementar( item: ProductosElegidos ) {
    item.cantidad -= 1;
    item.monto = item.producto.pCompra * item.cantidad;
    if( item.cantidad <= 0 ) {
      let index = this.productosElegidos.indexOf( item );
      this.productosElegidos.splice( index, 1);
    }
    this.productosElegidos = this.productosElegidos.map( el => Object.assign( {}, el ));
    this.calcularTotales();
  }

  calcularTotales(){
    this.totalProductos = 0;
    this.productosElegidos.forEach( r => {
      this.totalProductos += r.monto;
    });

    this.total = this.totalProductos;
  }

  // Cuando modifico el precio de algun Producto
  calcularProducto( item: ProductosElegidos, event) {
    item.cantidad = Number(event.target.value);
    item.monto = item.producto.pCompra * item.cantidad;
    this.calcularTotales();
  }


  // GUARDO LA VENTA EN LA BASE DE DATOS
  Guardar() {
    // Tengo que transformar tanto los productos como los turnos al modelo aceptado de solo el id
    
    const productosCompra: ProductosCompras[] = [];    
    this.productosElegidos.forEach( resp => {
      productosCompra.push( new ProductosCompras( resp.cantidad, resp.monto, resp.producto._id ));
    });

    const compra = new Compra( moment(new Date(), 'YYYY-MM-DD').toDate(), this.total, productosCompra );


    

    this.comprasService.crearCompra( compra ).subscribe( resp => {

       this.productosElegidos = [];
       this.totalProductos = 0;
       this.totalProductos = 0;
       this.total = 0;
        
       return;
    },
    error => Swal.fire('Error', 'La compra no se pudo guardar', 'error').then()
    );

  }

}
