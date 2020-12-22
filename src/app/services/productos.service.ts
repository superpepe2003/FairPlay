import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CargarProductos } from '../interfaces/cargar-productos.interface';
import { map } from 'rxjs/operators';
import { Producto } from '../model/productos.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  base_url = environment.url;

  constructor( private http: HttpClient) { }

  cargarProductos( desde: number = 0, limit: number = 0 ) {

    const url = `${ this.base_url }/productos?desde=${ desde }&hasta=${ limit }`;
    return this.http.get<CargarProductos>( url )
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
    return this.http.post( url, producto );
  }

  modificarProducto( producto: Producto ){
    const url = `${ this.base_url }/productos/${ producto._id }`;
    return this.http.put( url, producto );
  }

  eliminarProducto( id ) {

    const url = `${ this.base_url }/productos/${ id }`;
    return this.http.delete( url );
  }

}
