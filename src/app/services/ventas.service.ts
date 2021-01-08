import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Venta } from '../model/ventas.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CargarVentas } from '../interfaces/cargar-ventas.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  base_url = environment.url;

  constructor( private http: HttpClient) { }

  listarVenta( fecha1: NgbDate, fecha2: NgbDate){
    const f1 = moment( `${ fecha1.year }-${ fecha1.month }-${ fecha1.day }`, 'YYYY-MM-DD').format('YYYY-MM-DD').toString();;
    const f2 = moment( `${ fecha2.year }-${ fecha2.month }-${ fecha2.day }`, 'YYYY-MM-DD').format('YYYY-MM-DD').toString();

    const url = `${ this.base_url }/ventas?fechaInicial=${ f1 }&fechaFinal=${ f2 }`;
    return this.http.get<CargarVentas>(url).pipe(
        map( resp => {
          const ventas = resp.ventas.map(
             v => new Venta( v.fecha, v.monto, v.productos, v.turnos )
          );

          return {
            total: resp.total,
            ventas
          };
        })  
    );

  }

  crearVenta( venta: Venta) {
    const url = `${ this.base_url}/ventas`;
    return this.http.post(url, venta);
  }

}
