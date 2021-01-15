import { Component, Input, OnInit } from '@angular/core';
import { Venta } from '../../model/ventas.model';
import { Movimiento } from '../../model/movimientos.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-detalle',
  templateUrl: './modal-detalle.component.html',
  styleUrls: ['./modal-detalle.component.css']
})
export class ModalDetalleComponent implements OnInit {

  @Input() venta: Venta = null;
  @Input() movimiento: Movimiento = null;

  isMovimiento = true;

  constructor( public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if( this.venta ) {
      this.isMovimiento = false;
    } else {
      this.isMovimiento = true;
    }
  }

}
