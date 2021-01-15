import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbCalendar, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../model/ngbdatapickerformato';
import { VentasService } from '../../services/ventas.service';
import { Venta } from '../../model/ventas.model';
import * as moment from 'moment';
import { MovimientosService } from '../../services/movimientos.service';
import { Movimiento } from '../../model/movimientos.model';
import { ModalDetalleComponent } from '../../components/modal-detalle/modal-detalle.component';


@Component({
  selector: 'app-balances',
  templateUrl: './balances.component.html',
  styleUrls: ['./balances.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
   ]
})
export class BalancesComponent implements OnInit {

  fechaInicial: NgbDate;
  fechaFinal: NgbDate;
  cargando = true;
  total = 0;
  totalVentas = 0;
  totalTurnos = 0;
  totalMovimientosIngresos = 0;
  totalMovimientosGastos = 0;
  totalEnCaja = 0;

  ventas: Venta[];
  movimientos: Movimiento[];


  constructor( private calendar: NgbCalendar,
               private ventasService: VentasService,
               private movimientosService: MovimientosService,
               private modal: NgbModal) { }

  ngOnInit(): void {
    this.fechaInicial = this.calendar.getToday();
    this.fechaFinal = this.calendar.getNext( this.fechaInicial, 'd', 1);
    this.cargarTodo();
  }

  async cargarTodo(){
    
    this.cargando = true;
    await this.cargarVentas();
    await this.cargarGastos();
    this.cargarTotales();
    this.cargando = false;
  }

  async cargarVentas() {
    const { ventas, total} = await this.ventasService.listarVenta( this.fechaInicial, this.fechaFinal ).toPromise();
    this.ventas = ventas;
  }

  async cargarGastos() {
    const { movimientos, totalEnCaja} = await this.movimientosService.listarMovimientosxFecha( this.fechaInicial, this.fechaFinal ).toPromise();
    this.totalEnCaja = totalEnCaja;
    this.movimientos = movimientos;
  }

  cargarTotales() {
    this.totalTurnos = 0;
    this.totalVentas = 0;
    this.totalMovimientosIngresos = 0;
    this.totalMovimientosGastos = 0;
    this.ventas.forEach( v => {
      this.totalVentas += v.monto;
      v.turnos.forEach( v2 => {
        this.totalTurnos += v2.monto;
      })
    });
    this.movimientos.forEach( g => {
      if( g.tipo === 0 ){
        this.totalMovimientosGastos += g.monto;
      } else {
        this.totalMovimientosIngresos += g.monto;
      }
    });
    this.totalVentas -= this.totalTurnos;
    this.total = this.totalTurnos + this.totalVentas - this.totalMovimientosGastos + this.totalMovimientosIngresos;
  }

  mostrarItem( item, index ) {

    const modalRef = this.modal.open( ModalDetalleComponent, { windowClass : "my-class"});

    if( index === 0 ) {
      modalRef.componentInstance.venta = item;
    } else if ( index === 1 ) {
      modalRef.componentInstance.movimiento = item;
    }

  }

  onSelectFechaInicial() {
    this.comprobarFechas();
    this.cargarTodo();
  }

  onSelectFechaFinal() {
    this.comprobarFechas();
    this.cargarTodo();
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
}
