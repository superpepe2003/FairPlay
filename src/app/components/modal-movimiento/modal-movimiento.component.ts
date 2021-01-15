import { Component, Input, OnInit } from '@angular/core';
import { Movimiento } from '../../model/movimientos.model';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgbDateCustomParserFormatter } from '../../model/ngbdatapickerformato';
import { MovimientosService } from '../../services/movimientos.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { moveEmitHelpers } from 'typescript';
import { Options } from 'select2';

@Component({
  selector: 'app-modal-movimiento',
  templateUrl: './modal-movimiento.component.html',
  styleUrls: ['./modal-movimiento.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
   ]
})
export class ModalMovimientoComponent implements OnInit {
  
  @Input() isModificar = false;
  @Input() movimiento: Movimiento = null;
  nuevo = false;

  _fecha: NgbDate;
  tipo = [{ id: '0', text: 'Gasto'}, { id: '1', text: 'Ingreso'}];
  options: Options = {
    theme: 'bootstrap4',
    width: '100%'
  };

  public formMovimiento = this.fb.group({
    fecha: ['', Validators.required ],
    monto: ['', Validators.required ],
    tipo: ['', Validators.required],
    descripcion: ['', Validators.required ],
  });

  constructor( public activeModal: NgbActiveModal,
               public fb: FormBuilder,
               public calendar: NgbCalendar,
               private movimientosService: MovimientosService,
               private toastr: ToastrService ) { }

  get fecha(): NgbDate {
    return this._fecha;
  }

  set fecha( d: NgbDate ) {
    this._fecha = d;
    this.formMovimiento.patchValue( { fecha: new Date( d['year'], d['month'] - 1,
                               d['day']) });
  }

  ngOnInit(): void {
    this.fecha = this.calendar.getToday();

    this.resetearCampos();
    if( this.isModificar ) {
      this.cargarCampos();
    }
  }

  crearMovimiento() {

    if( this.formMovimiento.invalid ){
      return;
    }

    let movimiento:Movimiento;
    movimiento = this.formMovimiento.value;

    let momento = moment();
    let fecha = moment(`${ this.fecha.year }-${ this.fecha.month }-${ this.fecha.day }`, 'YYYY-MM-DD')
                    .hour(Number(moment().format('HH')))
                    .minute(Number(moment().format('mm')))
                    .second(Number(moment().format('ss')));
    movimiento.fecha = fecha.toDate();

    this.movimientosService.crearMovimiento( movimiento )
        .subscribe( resp => {
          this.resetearCampos();
          this.nuevo = true;
          this.toastr.success('El gasto se creo correctamente', 
                              'Creado',
                              {
                                timeOut: 3000,
                              });
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        });
  }

  modificarMovimiento() {

    if( this.formMovimiento.invalid ){
      return;
    }

    this.movimiento.fecha = this.formMovimiento.get('fecha').value;
    this.movimiento.monto = this.formMovimiento.get('monto').value;
    this.movimiento.tipo = this.formMovimiento.get('tipo').value;
    this.movimiento.descripcion = this.formMovimiento.get('descripcion').value;

    this.movimientosService.modificarMovimiento( this.movimiento )
        .subscribe( resp => {
          
          this.toastr.success('El gasto se modifco correctamente', 
                              'Modificado',
                              {
                                timeOut: 3000,
                              });
          this.activeModal.close( true );

        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        });
  }

  cargarCampos() {
    this.formMovimiento.reset({      
      monto: this.movimiento.monto,
      tipo: this.movimiento.tipo,
      descripcion: this.movimiento.descripcion,
    });
    this.fecha = new NgbDate(
      Number(moment(this.movimiento.fecha).format('yyyy')),
      Number(moment(this.movimiento.fecha).format('MM')),
      Number(moment(this.movimiento.fecha).format('DD'))
    );    
  }

  resetearCampos() {
    this.formMovimiento.reset({
      fecha: '',
      monto: '',
      tipo: 0,
      descripcion: '',
    });
    this.fecha = this.calendar.getToday();
    this.nuevo = false;
  }


}
