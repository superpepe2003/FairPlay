import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { BusquedasService } from '../../services/busquedas.service';
import { ProductosService } from '../../services/productos.service';
import { Producto } from 'src/app/model/productos.model';
import { ModalProductoComponent } from '../../components/modal-producto/modal-producto.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})

export class ProductoComponent implements OnInit, OnDestroy {

  productos: Producto[] = [];
  productosTemp: Producto[] = [];
  productosSub$: Subscription[] = [];
  totalProductos = 0;
  desde = 0;
  cargando = true;

  constructor( private modalService: NgbModal,
               private productoService: ProductosService,
               private productoSearch: BusquedasService
               ) { }

  ngOnInit(): void {
    this.cargaProductos();
  }

  cargaProductos() {
    this.cargando = true;
    this.productosSub$.push( this.productoService.cargarProductos( this.desde )
        .subscribe( ({ productos, total }) => {
          this.productos = productos;
          this.totalProductos = total;
          this.productosTemp = productos;
          this.cargando = false;
        })
    );
  }

  
  cambiarPagina( desde: number ) {
    this.desde += desde;
    if( this.desde < 0 ) {
      this.desde = 0;
      return;
    } else if ( this.desde >= this.totalProductos ) {
      this.desde -= desde;
      return;
    }
    
    this.cargaProductos();
  }

  buscar( termino: string ) {
    if( termino.length === 0 ) {
      return this.productos = this.productosTemp;
    } 
    this.productosSub$.push( this.productoSearch.buscar('productos', termino)
        .subscribe( (resp: any) => {
          this.productos = resp;
        })
    );
  }

  abrirModal( producto: Producto = null) {

    const modalRef = this.modalService.open( ModalProductoComponent );

    if( producto ) {
      modalRef.componentInstance.producto = producto;
      modalRef.componentInstance.isModificar = true;
    }

    modalRef.result.then( resp => {
      if( resp === true) {
        this.cargaProductos();
      }
    }, ( reason ) => {
      if( reason === true ) {
        this.cargaProductos();
      }
    })

  }


  deleteProducto( item: Producto ) {
    Swal.fire({
      title: '¿Borrar Producto?',
      text: `Esta a punto de borrar ${ item.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.productoService.eliminarProducto( item._id )
          .subscribe( resp => {
            Swal.fire(
              'Producto borrado!',
              `${ item.nombre } fue elimnado correctamente`,
              'success');
            this.cargaProductos();
            });

      }
    });
  }

  async agregarStock( item: Producto ){
    const { value } = await Swal.fire({
      title: 'Stock',
      input: 'number',
      inputLabel: `Cantidad de ${ item.nombre } comprada`,
      inputValue: '0',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'escribe un valor'
        }        
      }
    });

    if( value ) {
      item.stock += Number(value);
      await this.productoService.modificarProducto( item ).toPromise();
    }
  }
  
  ngOnDestroy() {
    this.productosSub$.forEach( resp => resp.unsubscribe());
    this.productosSub$ = []
  }


  
}
