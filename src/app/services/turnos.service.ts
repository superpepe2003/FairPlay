import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarTurnos } from '../interfaces/cargar-turnos.interface';
import { Turno } from '../model/turnos.model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  base_url = environment.url;
  id_turno = '';

  constructor( private http: HttpClient,
               private user: UsuarioService ) { }


  cargarTurnos( fecha: string, fecha2: string = '', estado: string = '' ) {

    if( fecha2.length === 0 || fecha2 === '') {
      fecha2 = moment(fecha).add(1,'days').format('YYYY-MM-DD').toString();
    }

    const url = `${ this.base_url }/turnos?fecha=${ fecha }&fecha2=${ fecha2 }&estado=${ estado }`;

    return this.http.get<CargarTurnos>( url, this.user.headers )
               .pipe(
                 map( resp => {
                   console.log(resp);
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

  // Comprueba que el turno no exista en la base de datos

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

      return this.http.get( url, this.user.headers )
            .pipe(
              map( ( resp: any ) => {
                if ( this.id_turno ) {
                  // Verifico que si existe no sea el mismo que modifico
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
      return this.http.post( url, turno, this.user.headers );
    }

    modificarTurno( turno: Turno) {
      const url = `${ this.base_url }/turnos/${ turno._id }`;
      // turno.cliente = turno.cliente['_id'];
      return this.http.put( url, turno, this.user.headers );
    }

    eliminarTurno( id: string ){
      const url = `${ this.base_url }/turnos/${ id }`;
      return this.http.delete( url, this.user.headers );
    }

  }
