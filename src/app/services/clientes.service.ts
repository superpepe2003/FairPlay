import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarClientes } from '../interfaces/cargar-clientes.interface';
import { Cliente } from '../model/clientes.model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  base_url = environment.url;

  constructor( private http: HttpClient,
               private user: UsuarioService ) { }

  cargarClientes( desde: number = 0, limit: number = 0 ) {
  
    const url = `${ this.base_url }/clientes?desde=${ desde }&hasta=${ limit }`;

    return this.http.get<CargarClientes>( url, this.user.headers ).pipe(
          map( resp => {
            if( ! resp ){ return { total: 0, clientes: [] }; }
            const clientes = resp.clientes.map(
             cliente => new Cliente( cliente.nombreCompleto, cliente.telefono, cliente.instagram, cliente.fechaNac, cliente._id, cliente.img )
            );
    
            return {
              total: resp.total,
              clientes
            };
          })
        )

  }

  cargarClientesTodos( ) {
  
    const url = `${ this.base_url }/clientes/todos/`;

    return this.http.get<CargarClientes>( url, this.user.headers ).pipe(
          map( resp => {
            if ( ! resp ){ return { total: 0, clientes: [] }; }
            const clientes = resp.clientes.map(
             cliente => new Cliente( cliente.nombreCompleto, cliente.telefono, cliente.instagram, cliente.fechaNac, cliente._id, cliente.img )
            );

            return {
              total: resp.total,
              clientes
            };
          })
        )

  }

  cargarClientesTodosSelect(){
    return this.cargarClientesTodos()
               .pipe(
                 map( ({ clientes }) => {
                    const client = clientes.map(
                      c => ({ id: c._id, text: c.nombreCompleto })
                    );

                    return {
                      clientes: client
                    };
                 })
               );
  }

  crearCliente( cliente: Cliente ){
    const url = `${ this.base_url }/clientes`;
    return this.http.post( url, cliente, this.user.headers );
  }

  modificarCliente( cliente: Cliente ){
    const url = `${ this.base_url }/clientes/${ cliente._id }`;
    return this.http.put( url, cliente, this.user.headers );
  }

  eliminarCliente( id ) {

    const url = `${ this.base_url }/clientes/${ id }`;
    return this.http.delete( url, this.user.headers );
  }

}
