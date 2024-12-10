// a. CPF deve ser válido (vide Anexo A).
// b. O nome do usuário deve ter pelo menos 5 caracteres.
// c. A data de nascimento deve ser fornecida no formato DD/MM/AAAA.
// d. Caso algum dado seja inválido, deve ser apresentada uma mensagem de erro e o dado deve ser solicitado novamente.
// e. Não podem existir dois pacientes com o mesmo CPF.
// f. O dentista não atende crianças, logo o paciente deve ter 13 anos ou mais no momento do cadastro (data atual).

// a. Um paciente com uma consulta agendada futura não pode ser excluído.
// b. Se o paciente tiver uma ou mais consultas agendadas passadas, ele pode ser excluído. Nesse caso, os respectivos agendamentos também devem ser excluídos.

import { PacienteRepository } from '../repositories/PacienteRepository'
import { ConsultaService } from "./ConsultaService";
import { IPaciente } from '../domain/Paciente'

export class PacienteService {
    private pacienteRepository: PacienteRepository;

    constructor(pacienteRepository: PacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    async adicionarPaciente(nome: string, cpf: string, dataNascimento: Date): Promise<IPaciente> {
        this.validarPaciente(nome, cpf, dataNascimento);
        const paciente: IPaciente = { nome, cpf, dataNascimento };
        return await this.pacienteRepository.create(paciente);
    }

    async excluirPaciente(cpf: string): Promise<void> {
        const paciente = await this.getPaciente(cpf);
        if(await ConsultaService.prototype.pacienteTemConsultasFuturas(paciente)) {
            throw new Error("Paciente com consulta futura não pode ser excluído");
        }
        await this.pacienteRepository.delete(paciente);
    }

    async listarPacientesPorCPF(): Promise<IPaciente[]> {
        return await this.pacienteRepository.findAll('cpf');
    }

    async listarPacientesPorNome(): Promise<IPaciente[]> {
        return await this.pacienteRepository.findAll('nome');
    }

    async getPaciente(cpf: string): Promise<IPaciente> {
        const paciente = await this.pacienteRepository.findByCPF(cpf);
        if (!paciente) {
            throw new Error("Paciente não encontrado");
        }
        return paciente;
    }

    async getPacienteComId(cpf: string): Promise<IPaciente> {
        const paciente = await this.getPaciente(cpf);
        if (paciente.id === undefined) {
            throw new Error("Paciente não encontrado");
        }
        return paciente;
    }

    private validarPaciente(nome: string, cpf: string, dataNascimento: Date): void {
        if (nome.length < 5) throw new Error("Nome inválido");
        if (!this.validarCPF(cpf)) throw new Error("CPF inválido");
        this.validarIdade(dataNascimento);
    }

    private async validarCPF(cpf: string): Promise<boolean> {
        const cpfSemFormatacao = cpf.replace(/\D/g, '');
        if (cpfSemFormatacao.length !== 11) return false;

        const paciente = await this.pacienteRepository.findByCPF(cpf);
        if (!paciente) return false;

        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpfSemFormatacao.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfSemFormatacao.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpfSemFormatacao.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpfSemFormatacao.substring(10, 11));
    }


    private validarIdade(dataNascimento: Date): void {
        const hoje = new Date();
        const idade = hoje.getFullYear() - dataNascimento.getFullYear();
        const mesAniversarioPassou = hoje.getMonth() > dataNascimento.getMonth() ||
            (hoje.getMonth() === dataNascimento.getMonth() && hoje.getDate() >= dataNascimento.getDate());
        if (idade < 13 || (idade === 13 && !mesAniversarioPassou)) {
            throw new Error("Paciente deve ter 13 anos ou mais");
        }
    }
}
