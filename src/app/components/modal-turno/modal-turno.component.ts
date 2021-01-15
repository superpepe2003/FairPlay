import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbDate, NgbDatepickerConfig, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { Turno } from '../../model/turnos.model';
import { TurnosService } from '../../services/turnos.service';
import { Options } from 'select2';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ClientesService } from '../../services/clientes.service';
import { NgbDateCustomParserFormatter } from '../../model/ngbdatapickerformato';

interface TipoHora {
  hour: number;
  minute: number;
  second: number;
}

@Component({
  selector: 'app-modal-turno',
  templateUrl: './modal-turno.component.html',
  styleUrls: ['./modal-turno.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
   ]
})
export class ModalTurnoComponent implements OnInit {

  @Input() turno: Turno = null;
  @Input() isModificar = false;
  @Input() fechaGrilla = null;
  @Input() horaGrilla = null;
  @Input() canchaGrilla = null;

  isGrilla = false;
  
  public turnoForm = this.fb.group({
    cancha: ['', [ Validators.required ]],
    fecha: ['', [ Validators.required ]],
    hora: ['', [ Validators.required ]],
    precio: [''],
    cliente: [''],
    estado: [''],
    tipo: ['Normal'],
    descripcion: ['']
  }, { asyncValidators: this.turnoService.comprobarTurno() });

  private _fecha: NgbDate;
  private _hora: TipoHora = { hour: 16, minute: 0, second: 0 };
  public options: Options;
  nuevo = false;

  clientes: any[] = [];
  canchas = [{ id: '1', text: 'Cancha 1'}, { id: '2', text: 'Cancha 2'}];
  private _cliente = '';
  private _cancha = '';

  constructor( private modalService: NgbModal,
               public activeModal: NgbActiveModal,
               private fb: FormBuilder,
               private turnoService: TurnosService,              
               private calendarConfig: NgbDatepickerConfig,
               private calendar: NgbCalendar,
               private toastr: ToastrService,
               private clienteService: ClientesService) { }

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

  get fecha(): NgbDate {
    return this._fecha;
  }

  set fecha( d: NgbDate ) {
    this._fecha = d;
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

    this.cargarSelect();
    this.fecha = this.calendar.getToday();
    if( this.isModificar ) {
      this.cargarCampos();
    } else {
      this.resetearCampos();
    }
    

    if( this.fechaGrilla ) {
      this.fecha = this.fechaGrilla;
      this.hora = { hour: Number(this.horaGrilla), minute: 0, second:0 };
      this.cancha = this.canchaGrilla.toString();
      this.isGrilla = true;
    }
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
          this.nuevo = true;
          this.toastr.success('El turno se guardo correctamente', 
                              'Guardado',
                              {
                                timeOut: 3000,
                              });
          if( this.isGrilla ) {
            this.activeModal.close(true);
          }
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        });

  }

  modificarTurno() {

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

    this.turnoService.modificarTurno( this.turno )
        .subscribe( resp => {          
          this.toastr.success('El turno se modifico correctamente', 
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
    this.turnoForm.reset({
      cancha: '1',
      precio: '',
      estado: 'reservado',
      descripcion: '',
      tipo: 'normal',
    });
    this.fecha = this.fecha;
    this.hora = { hour: 16, minute: 0, second: 0 };
    this.turnoService.id_turno = null;
    this.nuevo = false;

    if( this.clientes.length > 0 ) {
      this.cliente = this.clientes[0].id;
    }
  }

  formNoValido() {
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
    this.fecha = new NgbDate(
      Number(moment(this.turno.fecha).format('yyyy')),
      Number(moment(this.turno.fecha).format('MM')),
      Number(moment(this.turno.fecha).format('DD'))
    );    
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

}
