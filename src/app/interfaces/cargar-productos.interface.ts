import { Producto } from '../model/productos.model';

export interface CargarProductos {
    total:     number;
    productos: Producto[];
}