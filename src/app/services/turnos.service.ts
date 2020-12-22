import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarTurnos } from '../interfaces/cargar-turnos.interface';
import { Turno } from '../model/turnos.model';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  base_url = environment.url;
  id_turno = '';

  constructor( private http: HttpClient ) { }

  cargarTurnos( fecha: string ) {

    const url = `${ this.base_url }/turnos?fecha=${ fecha }`;
    console.log(url);
    return this.http.get<CargarTurnos>( url )
               .pipe(
                 map( resp => {
                   const turnos = resp.turnos.map(
                      turno => new Turno( turno.cancha, turno.fecha, turno.hora, turno.dia, turno.precio, turno.cliente, turno.estado, turno.tipo, turno.descripcion, turno._id)
                   );

                   return {
                     total: resp.total,
                     turnos
                   };
                 })
               );

  }

  comprobarTurno( ): AsyncValidatorFn{

    return ( control: AbstractControl): Promise<ValidationErrors>
                                      | Observable<ValidationErrors> => {

      const cancha = control['controls']['cancha'].value;
      const fecha = moment(control['controls']['fecha'].value, 'YYYY-MM-DD').toISOString();
      const hora = control['controls']['hora'].value;

      if ( !cancha || !fecha || !hora ) {
        return new Promise( resolver => null );
      }

      const url = `${ this.base_url }/turnos/buscar?cancha=${ cancha }&hora=${ hora}&fecha=${fecha}`;

      return this.http.get( url )
            .pipe(
              map( ( resp: any ) => {
                if ( this.id_turno ) {
                  if ( resp.total > 0 && resp.turnos[0]._id !== this.id_turno ){
                    return { existe: true };
                  } else {
                    return null;
                  }
                } else {
                  return (resp.total > 0  ) ? { existe: true} : null;
                }

              }
              )
            );

      };

    }

    crearTurno( turno: Turno ){
      const url = `${ this.base_url }/turnos`;
      return this.http.post( url, turno );
    }

    modificarTurno( turno: Turno) {
      const url = `${ this.base_url }/turnos/${ turno._id }`;
      // turno.cliente = turno.cliente['_id'];
      // console.log(turno);
      return this.http.put( url, turno );
    }

    eliminarTurno( id: string ){
      const url = `${ this.base_url }/turnos/${ id }`;
      return this.http.delete( url );
    }

  }
