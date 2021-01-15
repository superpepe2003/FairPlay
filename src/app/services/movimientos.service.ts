import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CargarMovimientos } from '../interfaces/cargar-movimientos.interface';
import { map } from 'rxjs/operators';
import { Movimiento } from '../model/movimientos.model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {

  base_url = environment.url;

  constructor( private http: HttpClient,
               private user: UsuarioService) { }

  listarMovimientosxFecha( fecha1: NgbDate, fecha2: NgbDate, tipo: number = -1) {
    const f1 = moment( `${ fecha1.year }-${ fecha1.month }-${ fecha1.day }`, 'YYYY-MM-DD').format('YYYY-MM-DD').toString();;
    const f2 = moment( `${ fecha2.year }-${ fecha2.month }-${ fecha2.day }`, 'YYYY-MM-DD').format('YYYY-MM-DD').toString();

    let url = '';
    if ( tipo >=0 ) {
      url = `${ this.base_url }/movimientos/busqueda?fechaInicial=${ f1 }&fechaFinal=${ f2 }&tipo=${ tipo }`;
    } else {
      url = `${ this.base_url }/movimientos/busqueda?fechaInicial=${ f1 }&fechaFinal=${ f2 }`;
    }

    return this.http.get<CargarMovimientos>(url, this.user.headers)
            .pipe(
              map( resp => {
                const movimientos = resp.movimientos.map(
                  movi => new Movimiento( movi.fecha, movi.monto, movi.descripcion, movi.tipo, movi._id)
                );
                return {
                  totalEnCaja: resp.totalEnCaja,
                  total: resp.total,
                  movimientos
                }
              })
            );

  }

  crearMovimiento( movimiento: Movimiento) {
    const url = `${ this.base_url }/movimientos`;

    return this.http.post( url, movimiento, this.user.headers );
  }

  modificarMovimiento( movi: Movimiento ) {
    const url = `${ this.base_url }/movimientos/${ movi._id }`;

    return this.http.put( url, movi, this.user.headers );
  }

  eliminarMovimiento( id: string ) {
    const url = `${ this.base_url }/movimientos/${ id }`;

    return this.http.delete( url, this.user.headers );
  }

}
