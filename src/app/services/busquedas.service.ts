import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { debounceTime, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Producto } from '../model/productos.model';
import { Cliente } from '../model/clientes.model';
import { Usuario } from '../model/usuario.model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  base_url = environment.url;

  constructor( private http: HttpClient,
               private user: UsuarioService ) { }

  buscar(
    tipo: 'productos' | 'clientes' | 'usuarios',
    termino: string = ''
  ) {
    const url = `${ this.base_url }/search/${tipo}/${termino}`;

    return this.http.get<any[]>( url, this.user.headers )
            .pipe(              
              map( (resp: any) => {

                switch( tipo ){
                  case 'productos':
                    return this.transformarProductos( resp.resultados );
                  case 'clientes':
                    return this.transformarClientes( resp.resultados );
                  case 'usuarios':
                    return this.transformarUsuarios( resp.resultados );
                  default:
                    return [];
                }

              })
            );
  }

  transformarProductos(resultados: any[]): Producto[] {
    return resultados.map(
      produ => new Producto(produ.nombre, produ.pVenta, produ.pCompra, produ.description, produ._id, produ.codBarra, produ.stock)
    );
  }

  transformarClientes(resultados: any[]): Cliente[] {
    return resultados.map(
      cliente => new Cliente(cliente.nombreCompleto, cliente.telefono, cliente.instagram, cliente.fechaNac, cliente._id, cliente.img)
    );
  }

  transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      usuario => new Usuario(usuario.nombre, usuario.email, null, usuario.img, usuario.google, usuario.role, usuario._id )
    );
  }

}
