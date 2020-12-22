import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbCalendar, NgbDatepickerConfig, NgbDate, NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../model/clientes.model';
import { NgbDateCustomParserFormatter } from 'src/app/model/ngbdatapickerformato';
import { I18n, CustomDatepickerI18n } from 'src/app/model/ngbdatapickeridioma';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    I18n,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
   ]
})
export class ModalClienteComponent implements OnInit {

  @Input() cliente: Cliente;
  @Input() isModificar = false;

  public clienteForm = this.fb.group({
    nombreCompleto: ['', [ Validators.required ]],
    telefono: ['', [ Validators.required ]],
    instagram: ['', ],
    fechaNac: [ '', [Validators.required ]]
  });

  formSubmitted = false;
  _fecha: NgbDate;
  nuevo = false;

  constructor( public modal: NgbModal,
               public fb: FormBuilder,
               private clienteService: ClientesService,
               private calendar: NgbCalendar,
               private calendarConfig: NgbDatepickerConfig,
               public activeModal: NgbActiveModal ) {
  }

  getCampo( campo: string ) {
    return this.clienteForm.get( campo ).value;
  }

  get fecha(): NgbDate {
    return this._fecha;
  }

  set fecha( d: NgbDate ) {
    this._fecha = d;
    this.clienteForm.patchValue( { fechaNac: new Date( d['year'], d['month'] - 1,
                               d['day']) });
  }

  ngOnInit(): void {
    this.calendarConfig.startDate = this.calendar.getToday();
    if ( this.isModificar ) {
      this.cargarCampos();
    } else {
      this.resetearCampos();
    }
  }

  crearCliente() {
    this.formSubmitted = true;

    if( this.clienteForm.invalid ){
      return;
    }

    let cliente: Cliente;
    cliente = this.clienteForm.value;

    this.clienteService.crearCliente( cliente )
        .subscribe( resp => {
          this.resetearCampos();
          this.nuevo = true;
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        });
  }

  modificarCliente() {
    this.formSubmitted = true;
    if( this.clienteForm.invalid ) {
      return;
    }
  
    this.cliente.nombreCompleto = this.clienteForm.get('nombreCompleto').value;
    this.cliente.telefono = this.clienteForm.get('telefono').value;
    this.cliente.instagram = this.clienteForm.get('instagram').value;
    this.cliente.fechaNac = this.clienteForm.get('fechaNac').value;

    this.clienteService.modificarCliente( this.cliente )
          .subscribe( resp => {
            this.resetearCampos();
            this.isModificar = false;
            this.cliente = null;
            this.activeModal.close();
            //this.cargaProductos();
          }, (err) => {
            console.log('esto');
            Swal.fire('Error', err.error.msg, 'error');
          });

  }

  resetearCampos() {
    this.clienteForm.reset({
      nombreCompleto: '',
      telefono: '',
      instagram: ''
    });
    this.fecha = this.calendar.getToday();
    this.nuevo = false;
  }

  cargarCampos() {
    this.clienteForm.reset({
      nombreCompleto: this.cliente.nombreCompleto,
      telefono: this.cliente.telefono,
      instagram: this.cliente.instagram,
    });
    this.fecha = new NgbDate(
      Number(moment(this.cliente.fechaNac).format('yyyy')),
      Number(moment(this.cliente.fechaNac).format('MM')),
      Number(moment(this.cliente.fechaNac).format('DD'))
    );    
  }


  nose(){

    $( function() {
  
      // Date range picker
      $('#reservationdate').datetimepicker({
          format: 'L'
      });
      // Date range picker
      $('#reservation').daterangepicker();

    });

  }

}
