import { Cliente } from '../model/clientes.model';

export interface CargarClientes {
    total:     number;
    clientes: Cliente[];
}