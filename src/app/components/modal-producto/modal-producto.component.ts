import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Producto } from '../../model/productos.model';
import { ProductosService } from '../../services/productos.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit {

  @Input() producto: Producto;
  @Input() isModificar = false;

  public productoForm = this.fb.group({
    codBarra: ['', [ Validators.required ]],
    nombre: ['', [ Validators.required ]],
    descripcion: ['', ],
    pVenta: ['', [Validators.required ]],
    pCompra: ['', ],
    stock: ['']
  });
  
  formSubmitted = false;
  nuevo = false;

  constructor( private fb: FormBuilder,
               public modal: NgbModal, 
               private toastr: ToastrService,
               public activeModal: NgbActiveModal,
               private productoService: ProductosService) { }

  ngOnInit(): void {
    if( this.isModificar ) {
      this.cargarCampos();
    } else {
      this.resetearCampos();
    }
  }

  ///////////////////////////////////////////
  /// MODAL FUNCIONES                     ///
  //////////////////////////////////////////

  crearProducto() {
    this.formSubmitted = true;
    if( this.productoForm.invalid ){
      return;
    }

    let produc: Producto;
    produc = this.productoForm.value;
    this.productoService.crearProducto( produc )
        .subscribe( resp => {
          this.toastr.success('El producto se creo correctamente', 
                              'Creado',
                              {
                                timeOut: 3000,
                              });
          this.resetearCampos();
          this.nuevo = true;
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        });
  }

  modificarProducto() {
    this.formSubmitted = true;
    if( this.productoForm.invalid ) {
      return;
    }
  
    this.producto.codBarra = this.productoForm.get('codBarra').value;
    this.producto.nombre = this.productoForm.get('nombre').value;
    this.producto.descripcion = this.productoForm.get('descripcion').value;
    this.producto.pVenta = this.productoForm.get('pVenta').value;
    this.producto.pCompra = this.productoForm.get('pCompra').value || this.producto.pCompra ;
    this.producto.stock = this.productoForm.get('stock').value || this.producto.stock ;

    console.log(this.producto);

    this.productoService.modificarProducto( this.producto )
        .subscribe( resp => {
          this.toastr.success('El producto se modifico correctamente', 
                              'Modificado',
                              {
                                timeOut: 3000,
                              });
          this.activeModal.close( true );
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        });

  }

  resetearCampos() {
    this.productoForm.reset({
      codBarra: '',
      nombre: '',
      descripcion: '',
      pVenta: '',
      pCompra: '',
      stock: '',  
    });
    this.nuevo = false;
  }

  cargarCampos() {
    this.productoForm.reset({
      codBarra: this.producto.codBarra,
      nombre: this.producto.nombre,
      descripcion: this.producto.descripcion,
      pVenta: this.producto.pVenta,
      pCompra: this.producto.pCompra,
      stock: this.producto.stock,  
    });
  }

}
