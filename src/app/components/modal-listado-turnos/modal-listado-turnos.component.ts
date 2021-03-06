import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CargarTurnos } from '../../interfaces/cargar-turnos.interface';
import { TurnosService } from '../../services/turnos.service';
import { Subscription } from 'rxjs';
import { Turno } from '../../model/turnos.model';
import { NgbDateCustomParserFormatter } from 'src/app/model/ngbdatapickerformato';
import * as moment from 'moment';
import { ModalTurnoComponent } from '../modal-turno/modal-turno.component';

@Component({
  selector: 'app-modal-listado-turnos',
  templateUrl: './modal-listado-turnos.component.html',
  styleUrls: ['./modal-listado-turnos.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
   ]
})
export class ModalListadoTurnosComponent implements OnInit, OnDestroy {

  fecha: NgbDate;
  cargando = true;
  turnosSub$: Subscription;
  totalTurnos = 0;
  turnos = [];
  horarioMenor = 17;
  horarioMayor = 23;

  nombre = 'Disponible';
  tipo = '';

  semana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];

  horarios = [];
  dias = [];

  constructor( private modalService: NgbModal,
               private calendar: NgbCalendar,
               private turnoService: TurnosService,
               public activeModal: NgbActiveModal) { }


  ngOnDestroy(): void {
    if ( this.turnosSub$ ) {
      this.turnosSub$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.fecha = this.calendar.getToday();
    this.cargaTurnos();
  }

  async cargaTurnos(){
    this.cargando = true;

    let f1 = `${this.fecha.year}-${this.fecha.month}-${ this.fecha.day }`;
    let f2 = moment(f1, 'YYYY-MM-DD').add(7, 'd').format('YYYY-MM-DD');

    console.log(f1);
    console.log(f2);

    let t = await this.turnoService.cargarTurnos( f1, f2).toPromise();
    this.totalTurnos += t.total;

    this.separarTurnos( t.turnos );
    this.ordenarTurnos();
    this.cargarHoraDias();
    this.cargando = false;

  }

  

  onSelectFecha() {
    this.cargaTurnos();
  }

  separarTurnos( t: Turno[]) {
    let f1 = `${this.fecha.year}-${this.fecha.month}-${ this.fecha.day }`;
    let r = 0;

    for( let i = this.fecha.day; i < this.fecha.day + 7; i++) {
      
      let f1 = `${this.fecha.year}-${this.fecha.month}-${ i }`;

      this.turnos[r] = [];
      
      let turnosFiltrados = t.filter( c => {

        let f = new Date(f1);
        let f2 = new Date( c.fecha );
        f.setHours(0,0,0,0);
        f2.setHours(0,0,0,0);
        
        if( f2.getTime() == f.getTime() ) {
          return c;
        }  
      });
      this.turnos[r] = turnosFiltrados;

      r++;
    }

  }

  ordenarTurnos( ) {
    
    let menor = 17;
    let mayor = 22;

    for( let i = 0; i < this.turnos.length; i++) {
      this.turnos[i].sort( (a, b) => (a.hora > b.hora)? 1 : -1 );
      if( this.turnos[i].length > 0 ) {
        if( this.turnos[i][0].hora < menor ) {
          menor = this.turnos[i][0].hora;
        }
        if( this.turnos[i][this.turnos[i].length - 1].hora > mayor ) {
          mayor = this.turnos[i][this.turnos[i].length].hora;
        }
      }
    }
    this.horarioMenor = menor;
    this.horarioMayor = mayor;
  }

  cargarHoraDias() {
    this.dias = [];
    this.horarios = [];
    for( let i = this.horarioMenor; i<= this.horarioMayor; i++) {
      this.horarios.push( i );
    }

    let d = moment(`${this.fecha.year}-${this.fecha.month}-${ this.fecha.day }`).day();

    for( let i = d; i<= d + 6; i++) {
      if( i > 6) {
        this.dias.push( this.semana[ i - 7 ]);
      } else {
        this.dias.push( this.semana[ i ]);
      }
    }

  }

  buscarTurno( dia, hora, cancha ) {
    let texto = 'Disponible';
    this.nombre = 'Disponible';
    console.log(this.turnos);
    this.tipo = '';
    if( this.turnos[dia].length > 0 ) {
      let tur = this.turnos[dia].forEach((element: any) => {

        if ( element.hora === hora && element.cancha == cancha ) {
          texto = 'Existe';
          this.nombre = element.cliente.nombreCompleto;
          this.tipo = element.tipo;
        }

      });
      
    }
    return texto;
  }

  async seleccionarTurno( dia, hora, cancha) {
    if( this.buscarTurno( dia, hora, cancha) === 'Disponible' ){
      const modalRef = this.modalService.open(ModalTurnoComponent);

      let f = Object.assign({} , this.fecha);
      f.day += dia;
      modalRef.componentInstance.fechaGrilla = f;
      modalRef.componentInstance.horaGrilla = hora;
      modalRef.componentInstance.canchaGrilla = cancha;

      const resp = await modalRef.result;
      if ( resp ) {
        this.cargaTurnos();
      }

    }
    return;
  }

}
