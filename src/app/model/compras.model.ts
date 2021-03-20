
export class ProductosCompras {
    
    constructor(
        public cantidad: number,
        public monto: number,
        public producto: string
    ) {

    }
}

export class Compra {

    constructor(
        public fecha: Date,
        public monto: number,
        public productos: ProductosCompras[],
        public _id?: string
    ) {}

}