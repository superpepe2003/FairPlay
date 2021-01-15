import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbCalendar, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../model/ngbdatapickerformato';
import { Movimiento } from '../../model/movimientos.model';
import { MovimientosService } from '../../services/movimientos.service';
import * as moment from 'moment';
import { ModalMovimientoComponent } from '../../components/modal-movimiento/modal-movimiento.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
   ]
})
export class MovimientosComponent implements OnInit {

  cargando = true;
  
  fechaInicial: NgbDate;
  fechaFinal: NgbDate;
  movimientos: Movimiento[];

  constructor( private calendar: NgbCalendar,
               private modal: NgbModal,
               private moviService: MovimientosService) { }

  ngOnInit(): void {
    this.fechaInicial = this.calendar.getToday();
    this.fechaFinal = this.calendar.getNext( this.fechaInicial, 'd', 1);
    this.cargarMovimientos();
  }

  cargarMovimientos() {
    this.cargando = true;
    this.moviService.listarMovimientosxFecha( this.fechaInicial, this.fechaFinal )
        .subscribe( ({ movimientos, total }) => {

          this.movimientos = movimientos;
          this.cargando = false;
        });
  }

  onSelectFechaInicial() {
    this.comprobarFechas();
    this.cargarMovimientos();
  }

  onSelectFechaFinal() {
    this.comprobarFechas();
    this.cargarMovimientos();
  }

  comprobarFechas() {
    let moment1 = moment();
    let moment2 = moment();
    moment1.month( this.fechaInicial.month );
    moment1.day( this.fechaInicial.day );
    moment1.year( this.fechaInicial.year );
    moment2.month( this.fechaFinal.month );
    moment2.day( this.fechaFinal.day );
    moment2.year( this.fechaFinal.year );

    if( moment1.toDate().getTime() > moment2.toDate().getTime() ) {
      let temp = this.fechaInicial;
      this.fechaInicial = this.fechaFinal;
      this.fechaFinal = temp;
    }
  }

  abrirModal( item: Movimiento ) {

    const modalRef = this.modal.open( ModalMovimientoComponent );

    if( item ){
      modalRef.componentInstance.isModificar = true;
      modalRef.componentInstance.movimiento = item;
    }

    modalRef.result.then(
      ( result ) => {
        if( result ) {
          this.cargarMovimientos();
        }
      },
      ( reason ) => {
        if( reason ) {
          this.cargarMovimientos();
        }
      }
    )


  }

  deleteTurno( item: Movimiento) {
    Swal.fire({
      title: '¿Borrar Movimiento?',
      text: `Esta a punto de borrar un movimiento`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.moviService.eliminarMovimiento( item._id )
          .subscribe( resp => {
            Swal.fire(
              'Movimiento borrado!',
              `El Movimiento fue elimnado correctamente`,
              'success');
            this.cargarMovimientos();
            });

      }
    });
  }

}

