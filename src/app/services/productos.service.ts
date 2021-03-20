import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CargarProductos } from '../interfaces/cargar-productos.interface';
import { map, tap } from 'rxjs/operators';
import { Producto } from '../model/productos.model';
import { Observable } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  base_url = environment.url;

  constructor( private http: HttpClient,
               private user: UsuarioService) { }

  cargarProductos( desde: number = 0, limit: number = 0 ) {

    const url = `${ this.base_url }/productos?desde=${ desde }&hasta=${ limit }`;
    return this.http.get<CargarProductos>( url, this.user.headers )
               .pipe(
                 map( resp => {
                   const productos = resp.productos.map(
                      producto => new Producto( producto.nombre, producto.pVenta, producto.pCompra, producto.descripcion, producto._id, producto.codBarra, producto.stock)
                   );

                   return {
                     total: resp.total,
                     productos
                   };
                 })
               );

  }

  crearProducto( producto: Producto ){
    const url = `${ this.base_url }/productos`;
    return this.http.post( url, producto, this.user.headers );
  }

  modificarProducto( producto: Producto ){

    const url = `${ this.base_url }/productos/${ producto._id }`;
    return this.http.put( url, producto, this.user.headers ).pipe( tap( r => console.log ));

  }

  eliminarProducto( id ) {

    const url = `${ this.base_url }/productos/${ id }`;
    return this.http.delete( url, this.user.headers );
  }

  buscarPorCodigo( codigo ) : Observable<Producto> {

    const url = `${ this.base_url }/productos/${ codigo }`;
    return this.http.get<Producto>( url, this.user.headers )
          .pipe(
            map( (resp: any) => resp.producto )
          );

  }

}
