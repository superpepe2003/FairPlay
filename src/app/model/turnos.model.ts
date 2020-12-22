

export class Turno {

    constructor(
        public cancha: string,
        public fecha: Date,
        public hora: number,
        public dia?: string,
        public precio?: number,
        public cliente?: string,
        public estado?: string,
        public tipo?: string,
        public descripcion?: string,
        public _id?: string,
    ) {}

}
