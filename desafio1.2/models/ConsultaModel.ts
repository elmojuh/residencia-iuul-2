import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define os atributos para criação (onde ID é opcional)
export interface ConsultaCreationAttributes extends Optional<{
    id?: number;
    pacienteId: number;
    dataConsulta: Date;
    inicio: string;
    fim: string },
    'id'> {}

// Extender o Model para incluir os atributos
class ConsultaModel extends Model<ConsultaCreationAttributes> {
    public id!: number;
    public pacienteId!: number;
    public dataConsulta!: Date;
    public inicio!: string;
    public fim!: string;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ConsultaModel.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        pacienteId: { type: DataTypes.INTEGER, allowNull: false },
        dataConsulta: { type: DataTypes.DATE, allowNull: false },
        inicio: { type: DataTypes.STRING, allowNull: false },
        fim: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: 'Consulta' }
);

export default ConsultaModel;
