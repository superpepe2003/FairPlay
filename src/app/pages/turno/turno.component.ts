import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NgbDateCustomParserFormatter } from 'src/app/model/ngbdatapickerformato';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { Turno } from '../../model/turnos.model';
import { ClientesService } from '../../services/clientes.service';

import { Options } from 'select2';
import Swal from 'sweetalert2';
import { CargarTurnos } from '../../interfaces/cargar-turnos.interface';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

interface TipoHora {
  hour: number;
  minute: number;
  second: number;
}


@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
   ]

})
export class TurnoComponent implements OnInit, OnDestroy {


  public turnoForm = this.fb.group({
    cancha: ['', [ Validators.required ]],
    fecha: ['', [ Validators.required ]],
    hora: ['', [ Validators.required ]],
    precio: [''],
    cliente: [''],
    estado: ['reserva'],
    tipo: ['Normal'],
    descripcion: ['']
  }, { asyncValidators: this.turnoService.comprobarTurno() });

  turno: Turno = null;
  turnos: Turno[] = [];
  turnosTemp: Turno[] = [];
  turnosSub$: Subscription[] = [];
  totalTurnos = 0;
  desde = 0;
  cargando = true;
  isModificar = false;
  
  fecha: NgbDate;
  private _fecha2: NgbDate;
  private _hora: TipoHora = { hour: 16, minute: 0, second: 0 };
  public options: Options;

  clientes: any[] = [];
  canchas = [{ id: '1', text: 'Cancha 1'}, { id: '2', text: 'Cancha 2'}];
  private _cliente = '';
  private _cancha = '';

  constructor( private modalService: NgbModal,
               private turnoService: TurnosService,
               private turnoSearch: BusquedasService,
               private fb: FormBuilder,
               private calendarConfig: NgbDatepickerConfig,
               private calendar: NgbCalendar,
               private clienteService: ClientesService,
               private toastr: ToastrService
               ) { }

  //////////////////////////////////////////////
  //      PROPIEDADES PARA EL FORMULARIO     //
  ////////////////////////////////////////////

  get cliente(): string {
    return this._cliente;
  }

  set cliente(c: string) {
    if ( c.length > 0) {
      this.turnoForm.patchValue({ cliente: c });
      this._cliente = c;
    }
  }

  get hora() {
    return this._hora;
  }

  set hora( d: TipoHora ) {
    this._hora = d;
    this.turnoForm.patchValue( { hora: d.hour });
  }

  get fecha2(): NgbDate {
    return this._fecha2;
  }

  set fecha2( d: NgbDate ) {
    this._fecha2 = d;
    this.turnoForm.patchValue( { fecha: new Date( d['year'], d['month'] - 1,
                               d['day']) });
  }

  get cancha(): string {
    return this._cancha;
  }

  set cancha(c: string) {
    if ( c.length > 0) {
      this.turnoForm.patchValue({ cancha: c });
      this._cancha = c;
    }
  }

  ngOnInit(): void {
    this.calendarConfig.startDate = this.calendar.getToday();
    this.fecha = this.calendar.getToday();
    this.resetearCampos();
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

  abrirModal( modal: string, tur: Turno = null ) {
    this.cargarSelect();
    this.fecha2 = this.calendar.getToday();
    if ( tur ) {
      this.turno = tur;
      this.isModificar = true;
      this.cargarCampos();
    }
    this.modalService.open(modal).result.then(
      resp => {
        if ( this.isModificar ) {
          this.modificarTurno();
        }
      },
      (reason) => {
        if ( this.isModificar ){
          this.isModificar = false;
          this.turno = null;
        } else {
          this.cargaTurnos();
        }
        this.resetearCampos();
      });
  }

  cargarSelect() {

    this.clienteService.cargarClientesTodosSelect()
        .subscribe( (resp: any) => {
          this.clientes = resp.clientes;
          if ( resp ){
            if ( !this.isModificar ) {
              this.cliente = this.clientes[0].id;
            }
          }
        });

    this.cancha = this.canchas[0].id;

    this.options = {
      theme: 'bootstrap4',
      width: '100%'
    };


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


  ///////////////////////////////////////////
  /// MODAL FUNCIONES                     ///
  //////////////////////////////////////////

  crearTurno() {
    // this.formSubmitted = true;
    if ( this.turnoForm.invalid ){
       return;
    }

    let turno: Turno;
    turno = this.turnoForm.value;

    this.turnoService.crearTurno( turno )
        .subscribe( resp => {
          this.resetearCampos();
          console.log('Grabo');
          this.toastr.success('El turno se guardo correctamente', 
                              'Guardado',
                              {
                                timeOut: 3000,
                              });
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        });

  }

  modificarTurno() {
    console.log( this.turnoForm );
    if ( this.turnoForm.invalid ) {
      return;
    }

    this.turno.cliente = this.turnoForm.get('cliente').value;
    this.turno.cancha = this.turnoForm.get('cancha').value;
    this.turno.fecha = this.turnoForm.get('fecha').value;
    this.turno.hora = this.turnoForm.get('hora').value;
    this.turno.precio = this.turnoForm.get('precio').value;
    this.turno.estado = this.turnoForm.get('estado').value;
    this.turno.tipo = this.turnoForm.get('tipo').value;

    console.log( this.turno );
    this.turnoService.modificarTurno( this.turno )
        .subscribe( resp => {
          this.resetearCampos();
          this.isModificar = false;
          this.turno = null;
          this.cargaTurnos();
          this.toastr.success('El turno se modifico correctamente', 
                              'Modificado',
                              {
                                timeOut: 3000,
                              });
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        });

  }

  resetearCampos() {
    this.turnoForm.reset({
      cancha: '1',
      precio: '',
      cliente: '',
      estado: 'reserva',
      descripcion: '',
      tipo: 'normal',
    });
    this.fecha2 = this.calendar.getToday();
    this.hora = { hour: 16, minute: 0, second: 0 };
    this.turnoService.id_turno = null;
  }

  formNoValido() {
    // console.log(this.turnoForm);
    if ( this.turnoForm.hasError('existe') ) {
      return true;
    }
    return false;
  }

  cargarCampos() {
    this.turnoForm.reset({
      precio: this.turno.precio,
      descripcion: this.turno.descripcion,
      estado: this.turno.estado,
      tipo: this.turno.tipo
    });
    this.turnoService.id_turno = this.turno._id;
    this.cancha = this.turno.cancha;
    this.cliente = this.turno.cliente['_id'];
    this.hora = { hour: this.turno.hora, minute: 0, second: 0 };
    this.fecha2 = new NgbDate(
      Number(moment(this.turno.fecha).format('yyyy')),
      Number(moment(this.turno.fecha).format('MM')),
      Number(moment(this.turno.fecha).format('DD'))
    );    
  }
}
