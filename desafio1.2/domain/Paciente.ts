
export interface IPaciente {
    id?: number; // Opcional se for autoincrement
    nome: string;
    cpf: string;
    dataNascimento: Date;
}

export class Paciente implements IPaciente {
    constructor(
        public id: number | undefined,
        public nome: string,
        public cpf: string,
        public dataNascimento: Date
    ) {}
}
