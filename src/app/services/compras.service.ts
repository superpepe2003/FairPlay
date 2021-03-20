import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Venta } from '../model/ventas.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CargarVentas } from '../interfaces/cargar-ventas.interface';
import { map } from 'rxjs/operators';
import { UsuarioService } from './usuario.service';
import { CargarCompras } from '../interfaces/cargar-compras.interface';
import { Compra } from '../model/compras.model';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

    base_url = environment.url;
  
    constructor( private http: HttpClient, private user: UsuarioService) { }
  
    listarCompra( fecha1: NgbDate, fecha2: NgbDate){
      const f1 = moment( `${ fecha1.year }-${ fecha1.month }-${ fecha1.day }`, 'YYYY-MM-DD').format('YYYY-MM-DD').toString();;
      const f2 = moment( `${ fecha2.year }-${ fecha2.month }-${ fecha2.day }`, 'YYYY-MM-DD').format('YYYY-MM-DD').toString();
  
      const url = `${ this.base_url }/compras?fechaInicial=${ f1 }&fechaFinal=${ f2 }`;
      return this.http.get<CargarCompras>(url, this.user.headers).pipe(
          map( resp => {
            const compras = resp.compras.map(
               v => new Compra( v.fecha, v.monto, v.productos )
            );
  
            return {
              total: resp.total,
              compras
            };
          })  
      );
  
    }
  
    crearCompra( compra: Compra) {
      const url = `${ this.base_url}/compras`;
      return this.http.post(url, compra, this.user.headers);
    }
  
  }
  