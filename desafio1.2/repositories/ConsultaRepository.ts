import {Op} from "sequelize";
import ConsultaModel from '../models/ConsultaModel';
import { IConsulta, Consulta } from '../domain/Consulta';
import { PacienteRepository } from "./PacienteRepository";
import { Paciente } from "../domain/Paciente";

export class ConsultaRepository {
    private pacienteRepository = new PacienteRepository();

    async create(consulta: IConsulta): Promise<IConsulta> {
        const consultaModel = await ConsultaModel.create({
            pacienteId: consulta.paciente.id!,
            dataConsulta: consulta.dataConsulta,
            inicio: consulta.inicio,
            fim: consulta.fim
        });
        const pacienteData = await this.pacienteRepository.findById(consultaModel.pacienteId);
        if (!pacienteData) throw new Error('Paciente não encontrado');
        const paciente = new Paciente(
            pacienteData.id,
            pacienteData.nome,
            pacienteData.cpf,
            pacienteData.dataNascimento
        );
        return new Consulta(
            consultaModel.id,
            paciente,
            consultaModel.dataConsulta,
            consultaModel.inicio,
            consultaModel.fim
        );
    }

    async findByPacienteIdAndDate(pacienteId: number, data: Date): Promise<IConsulta | null> {
        const consultaModel = await ConsultaModel.findOne({ where: { pacienteId, dataConsulta: data } });
        if (!consultaModel) return null;
        const pacienteData = await this.pacienteRepository.findById(consultaModel.pacienteId);
        if (!pacienteData) throw new Error('Paciente não encontrado');
        const paciente = new Paciente(
            pacienteData.id,
            pacienteData.nome,
            pacienteData.cpf,
            pacienteData.dataNascimento
        );
        return new Consulta(
            consultaModel.id,
            paciente,
            consultaModel.dataConsulta,
            consultaModel.inicio,
            consultaModel.fim
        );
    }

    async findAllByPacienteId(pacienteId: number): Promise<IConsulta[]> {
        const consultasModel = await ConsultaModel.findAll({ where: { pacienteId } });
        const pacienteData = await this.pacienteRepository.findById(pacienteId);
        if (!pacienteData) throw new Error('Paciente não encontrado');

        const paciente = new Paciente(
            pacienteData.id,
            pacienteData.nome,
            pacienteData.cpf,
            pacienteData.dataNascimento
        );

        return consultasModel.map(consultaModel => new Consulta(
            consultaModel.id,
            paciente,
            consultaModel.dataConsulta,
            consultaModel.inicio,
            consultaModel.fim
        ));
    }


    async findAll(orderBy: string): Promise<IConsulta[]> {
        const consultasModel = await ConsultaModel.findAll({ order: [[orderBy, 'ASC']] });
        return Promise.all(consultasModel.map(async consultaModel => {
            const pacienteData = await this.pacienteRepository.findById(consultaModel.pacienteId);
            if (!pacienteData) throw new Error('Paciente não encontrado');
            const paciente = new Paciente(
                pacienteData.id,
                pacienteData.nome,
                pacienteData.cpf,
                pacienteData.dataNascimento
            );
            return new Consulta(
                consultaModel.id,
                paciente,
                consultaModel.dataConsulta,
                consultaModel.inicio,
                consultaModel.fim
            );
        }));
    }

    async findAllFuture(): Promise<IConsulta[]> {
        const consultasModel = await ConsultaModel.findAll({ where: { dataConsulta: { [Op.gte]: new Date() } }, order: [['dataConsulta', 'ASC']] });
        return Promise.all(consultasModel.map(async consultaModel => {
            const pacienteData = await this.pacienteRepository.findById(consultaModel.pacienteId);
            if (!pacienteData) throw new Error('Paciente não encontrado');
            const paciente = new Paciente(
                pacienteData.id,
                pacienteData.nome,
                pacienteData.cpf,
                pacienteData.dataNascimento
            );
            return new Consulta(
                consultaModel.id,
                paciente,
                consultaModel.dataConsulta,
                consultaModel.inicio,
                consultaModel.fim
            );
        }));
    }

    async findConsultasSobrepostas(data: Date, inicio: string, fim: string): Promise<IConsulta[]> {
        const consultasModel = await ConsultaModel.findAll({
            where: {
                dataConsulta: data,
                [Op.or]: [
                    { inicio: { [Op.lt]: fim, [Op.gte]: inicio } },
                    { fim: { [Op.lte]: fim, [Op.gt]: inicio } },
                ],
            },
        });
        return Promise.all(consultasModel.map(async consultaModel => {
            const pacienteData = await this.pacienteRepository.findById(consultaModel.pacienteId);
            if (!pacienteData) throw new Error('Paciente não encontrado');
            const paciente = new Paciente(
                pacienteData.id,
                pacienteData.nome,
                pacienteData.cpf,
                pacienteData.dataNascimento
            );
            return new Consulta(
                consultaModel.id,
                paciente,
                consultaModel.dataConsulta,
                consultaModel.inicio,
                consultaModel.fim
            );
        }));
    }

    async delete(consulta: IConsulta): Promise<void> {
        const consultaModel = await ConsultaModel.findByPk(consulta.id);
        if (consultaModel) {
            await consultaModel.destroy();
        }
    }
}
