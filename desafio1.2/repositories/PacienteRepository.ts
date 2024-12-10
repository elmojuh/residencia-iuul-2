import PacienteModel from '../models/PacienteModel';
import { IPaciente, Paciente } from '../domain/Paciente';

export class PacienteRepository {
    async create(paciente: IPaciente): Promise<IPaciente> {
        const pacienteModel = await PacienteModel.create(paciente);
        return new Paciente(
            pacienteModel.id,
            pacienteModel.nome,
            pacienteModel.cpf,
            pacienteModel.dataNascimento
        );
    }

    async findById(id: number): Promise<IPaciente | null> {
        const pacienteModel = await PacienteModel.findByPk(id);
        if (!pacienteModel) return null;
        return new Paciente(
            pacienteModel.id,
            pacienteModel.nome,
            pacienteModel.cpf,
            pacienteModel.dataNascimento
        );
    }

    async findByCPF(cpf: string): Promise<IPaciente | null> {
        const pacienteModel = await PacienteModel.findOne({ where: { cpf } });
        if (!pacienteModel) {
            throw new Error("Paciente não encontrado");
        }
        return new Paciente(
            pacienteModel.id,
            pacienteModel.nome,
            pacienteModel.cpf,
            pacienteModel.dataNascimento
        );
    }

    async findAll(orderBy: string): Promise<IPaciente[]> {
        const pacientesModel = await PacienteModel.findAll({ order: [[orderBy, 'ASC']] });
        return pacientesModel.map(pacienteModel => new Paciente(
            pacienteModel.id,
            pacienteModel.nome,
            pacienteModel.cpf,
            pacienteModel.dataNascimento
        ));
    }

    async delete(paciente: IPaciente): Promise<void> {
        const pacienteModel = await PacienteModel.findByPk(paciente.id);
        if (pacienteModel) {
            await pacienteModel.destroy();
        }
    }
}
