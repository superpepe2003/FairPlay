import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NgbDateCustomParserFormatter } from 'src/app/model/ngbdatapickerformato';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { Turno } from '../../model/turnos.model';

import Swal from 'sweetalert2';
import { ModalTurnoComponent } from '../../components/modal-turno/modal-turno.component';


@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
   ]

})
export class TurnoComponent implements OnInit, OnDestroy {

  turnos: Turno[] = [];
  turnosTemp: Turno[] = [];
  turnosSub$: Subscription[] = [];
  totalTurnos = 0;
  desde = 0;
  cargando = true;
  
  fecha: NgbDate;
  

  constructor( private modalService: NgbModal,
               private turnoService: TurnosService,
               private turnoSearch: BusquedasService,
               private calendarConfig: NgbDatepickerConfig,
               private calendar: NgbCalendar,
               ) { }

  

  ngOnInit(): void {
    this.calendarConfig.startDate = this.calendar.getToday();
    this.fecha = this.calendar.getToday();
    this.cargaTurnos();
    
  }

  ngOnDestroy() {
    this.turnosSub$.forEach( resp => resp.unsubscribe());
    this.turnosSub$ = [];
  }

  cargaTurnos() {
    this.cargando = true;
    this.turnosSub$.push( this.turnoService.cargarTurnos( `${this.fecha.year}-${this.fecha.month}-${this.fecha.day}` )
        .subscribe( ({ turnos, total }) => {
          this.turnos = turnos;
          this.totalTurnos = total;
          this.turnosTemp = turnos;
          this.cargando = false;
        })
    );
  }

  onSelectFecha() {
    this.cargaTurnos();
  }

  abrirModal( turno: Turno = null ) {
    
    const modalRef = this.modalService.open(ModalTurnoComponent);

    if( turno ) {
      modalRef.componentInstance.isModificar = true;
      modalRef.componentInstance.turno = turno;
    }

    modalRef.result.then( resp => {
      if( resp === true ) {
        this.cargaTurnos();
      }
    }, ( reason ) => {
      if( reason === true ) {
        this.cargaTurnos();
      }
    });

  }

  deleteTurno( item: Turno ) {
    Swal.fire({
      title: '¿Borrar Producto?',
      text: `Esta a punto de borrar el turno`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.turnoService.eliminarTurno( item._id )
          .subscribe( resp => {
            Swal.fire(
              'Turno borrado!',
              `El turno fue elimnado correctamente`,
              'success');
            this.cargaTurnos();
            });

      }
    });
  }

}
