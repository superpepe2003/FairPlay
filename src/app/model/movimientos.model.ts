
export class Movimiento {

    constructor(
        public fecha: Date,
        public monto?: number,
        public descripcion?: string,
        public tipo?: number,
        public _id?: string,        
    ) {}
}