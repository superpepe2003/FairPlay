
export class ProductosVentas {
    
    constructor(
        public cantidad: number,
        public monto: number,
        public producto: string
    ) {

    }
}

export class TurnosVentas {
    
    constructor(
        public monto: number,
        public turno: string
    ) {

    }
}

export class Venta {

    constructor(
        public fecha: Date,
        public monto: number,
        public productos: ProductosVentas[],
        public turnos: TurnosVentas[],
        public _id?: string
    ) {}

}
