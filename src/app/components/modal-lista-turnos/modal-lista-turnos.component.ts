import { Component, OnInit, OnDestroy } from '@angular/core';
import { Turno } from '../../model/turnos.model';
import { TurnosService } from '../../services/turnos.service';
import { Subscription } from 'rxjs';
import { NgbDate, NgbDatepickerConfig, NgbCalendar, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-lista-turnos',
  templateUrl: './modal-lista-turnos.component.html',
  styleUrls: ['./modal-lista-turnos.component.css']
})
export class ModalListaTurnosComponent implements OnInit, OnDestroy {

  turnos: Turno[] = [];
  cargando = false;
  turnosSub$: Subscription;
  fecha: NgbDate;

  constructor( private turnoService: TurnosService,
               public activeModal: NgbActiveModal,
               private calendarConfig: NgbDatepickerConfig,
               private calendar: NgbCalendar) { }

  ngOnDestroy(): void {
    if( this.turnosSub$ ){
      this.turnosSub$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.calendarConfig.startDate = this.calendar.getToday();
    this.fecha = this.calendar.getToday();
    this.cargaTurnos();
  }

  cargaTurnos() {
    this.cargando = true;
    this.turnosSub$ = this.turnoService.cargarTurnos( `${this.fecha.year}-${this.fecha.month}-${this.fecha.day}` )
        .subscribe( ({ turnos, total }) => {
          this.turnos = turnos;
          this.cargando = false;
        });
  }

  onSelectFecha() {
    this.cargaTurnos();
  }

}
