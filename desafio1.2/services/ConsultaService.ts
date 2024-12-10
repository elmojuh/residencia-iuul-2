// a. CPF deve existir no cadastro.
// b. A data da consulta deve ser fornecida no formato DD/MM/AAAA.
// c. Hora inicial e final devem ser fornecidos no formato HHMM (padrão brasileiro).
// d. O agendamento deve ser para um período futuro: data da consulta > data atual ou (data da consulta = data atual e hora inicial > hora atual).
// e. Hora final > hora inicial.
// f. Cada paciente só pode realizar um agendamento futuro por vez (os agendamentos passados não podem ser usados nessa verificação).
// g. Não pode haver agendamentos sobrepostos.
// h. As horas inicial e final são definidas sempre de 15 em 15 minutos. Assim, são válidas horas como 1400, 1730, 1615, 1000 e 0715. Por outro lado, não são válidas horas como 1820, 1235, 0810 e 1950.
// i. O horário de funcionamento do consultório é das 8:00h às 19:00h, logo os horários de agendamento não podem sair desses limites.

// a. O cancelamento só pode ser realizado se for de um agendamento futuro (data do agendamento > data atual ou (data do agendamento = data atual e hora inicial > hora atual)).

// a. A listagem da agenda deve ser apresentada conforme o layout definido no final desse documento e deve estar ordenada de forma crescente por data e hora inicial.
// b. O usuário pode listar toda a agenda ou a agenda de um período. Nesse último caso, deve ser solicitada a data inicial e final (formato DD/MM/AAAA).

import { ConsultaRepository } from '../repositories/ConsultaRepository'
import { PacienteService } from './PacienteService';
import { IConsulta, Consulta } from '../domain/Consulta';
import {IPaciente, Paciente} from '../domain/Paciente';
import { DateTime } from 'luxon';

export class ConsultaService {
    private consultaRepository: ConsultaRepository;
    private pacienteService: PacienteService;

    constructor(consultaRepository: ConsultaRepository, pacienteService: PacienteService) {
        this.consultaRepository = consultaRepository;
        this.pacienteService = pacienteService;
    }

    async agendarConsulta(cpf: string, data: Date, inicio: string, fim: string): Promise<IConsulta> {
        const pacienteData: IPaciente = await this.pacienteService.getPaciente(cpf);
        const paciente = new Paciente(
            pacienteData.id!,
            pacienteData.nome,
            pacienteData.cpf,
            pacienteData.dataNascimento
        );

        this.validarConsulta(paciente, data, inicio, fim);

        const consulta: IConsulta = { paciente, dataConsulta: data, inicio, fim };
        return await this.consultaRepository.create(consulta);
    }

    async cancelarConsulta(cpf: string, data: Date, inicio: string): Promise<void> {
        const paciente = await this.pacienteService.getPaciente(cpf);
        if (paciente.id === undefined) {
            throw new Error("Paciente não encontrado");
        }
        const consulta = await this.consultaRepository.findByPacienteIdAndDate(paciente.id, data);

        if (!consulta) throw new Error("Consulta não encontrada");

        await this.consultaRepository.delete(consulta);
    }

    async listarConsultas(dataInicio?: Date, dataFim?: Date): Promise<IConsulta[]> {
        const where: any = {};
        if (dataInicio && dataFim) {
            where.dataConsulta = { $between: [dataInicio, dataFim] };
        }
        return await this.consultaRepository.findAll('dataConsulta');
    }

    private async validarConsulta(paciente: IPaciente, data: Date, inicio: string, fim: string): Promise<void> {
        const agora = DateTime.now();
        const dataConsulta = DateTime.fromJSDate(data);
        const horarioInicio = DateTime.fromObject({ hour: parseInt(inicio.slice(0, 2)), minute: parseInt(inicio.slice(2)) });
        const horarioFim = DateTime.fromObject({ hour: parseInt(fim.slice(0, 2)), minute: parseInt(fim.slice(2)) });

        if (dataConsulta < agora || (dataConsulta.equals(agora) && horarioInicio <= agora)) {
            throw new Error("O agendamento deve ser para um período futuro.");
        }

        if (horarioFim <= horarioInicio) {
            throw new Error("A hora final deve ser maior que a hora inicial.");
        }

        if (!this.validarHorario(inicio) || !this.validarHorario(fim)) {
            throw new Error("Horários devem ser múltiplos de 15 minutos.");
        }

        if (!this.validarHorarioFuncionamento(inicio, fim)) {
            throw new Error("Horário fora do funcionamento (08:00 às 19:00).");
        }

        if(paciente.id === undefined) {
            throw new Error("Paciente não encontrado");
        }

        const consultaFutura = await this.consultaRepository.findByPacienteIdAndDate(paciente.id, data);
        if (consultaFutura) throw new Error("Paciente já possui consulta futura.");

        const consultasSobrepostas = await this.consultaRepository.findConsultasSobrepostas(data, inicio, fim);

        if (consultasSobrepostas.length > 0) {
            throw new Error("Já existe uma consulta nesse horário.");
        }
    }

    async pacienteTemConsultasFuturas(paciente: IPaciente): Promise<boolean> {
        if (paciente.id === undefined) {
            throw new Error("Paciente não encontrado");
        }
        const consultaFutura = await this.consultaRepository.findAllByPacienteId(paciente.id);
        if(consultaFutura.length > 0) {
            const agora = DateTime.now();
            const dataConsulta = DateTime.fromJSDate(consultaFutura[0].dataConsulta);
            if(dataConsulta > agora) {
                return true;
            }
        }
        return false;
    }

    private validarHorario(hora: string): boolean {
        const [h, m] = hora.split(':').map(Number);
        return (m % 15 === 0) && (h >= 0 && h <= 23) && (m >= 0 && m < 60);
    }

    private validarHorarioFuncionamento(inicio: string, fim: string): boolean {
        const horarioInicio = parseInt(inicio.replace(':', ''), 10);
        const horarioFim = parseInt(fim.replace(':', ''), 10);
        return horarioInicio >= 800 && horarioFim <= 1900;
    }
}
