import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../model/ngbdatapickerformato';
import { VentasService } from '../../services/ventas.service';
import { Venta } from '../../model/ventas.model';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
   ]
})
export class CajaComponent implements OnInit {

  fechaInicial: NgbDate;
  fechaFinal: NgbDate;
  cargando = true;

  ventas: Venta[];


  constructor( private calendar: NgbCalendar,
               private ventasService: VentasService) { }

  ngOnInit(): void {
    this.fechaInicial = this.calendar.getToday();
    this.fechaFinal = this.calendar.getNext( this.fechaInicial, 'd', 1);
    this.cargarVentas();
  }

  cargarVentas() {
    this.cargando = true;
    this.ventasService.listarVenta( this.fechaInicial, this.fechaFinal )
        .subscribe( ({ ventas, total }) => {

          console.log(ventas);
          this.ventas = ventas;
          this.cargando = false;
        });
  }

  onSelectFechaInicial() {
    this.cargarVentas();
  }

  onSelectFechaFinal() {
    this.cargarVentas();
  }

}
