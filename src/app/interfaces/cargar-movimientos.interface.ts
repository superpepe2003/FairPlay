import { Movimiento } from '../model/movimientos.model';

export interface CargarMovimientos {
    total:     number;
    totalEnCaja: number;
    movimientos: Movimiento[];
}