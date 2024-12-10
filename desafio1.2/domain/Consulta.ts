import { Paciente } from './Paciente';

export interface IConsulta {
    id?: number; // Opcional se for autoincrement
    paciente: Paciente;
    dataConsulta: Date;
    inicio: string;
    fim: string;
}

export class Consulta implements IConsulta {
    constructor(
        public id: number | undefined,
        public paciente: Paciente,
        public dataConsulta: Date,
        public inicio: string,
        public fim: string
    ) {}
}
