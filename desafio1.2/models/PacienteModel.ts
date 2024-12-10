import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../config/database";

// Define os atributos para criação (onde ID é opcional)
export interface PacienteCreationAttributes extends Optional<{
    id?: number;
    nome: string;
    cpf: string;
    dataNascimento: Date;
}, 'id'> {}

// Extender o Model para incluir os atributos
class PacienteModel extends Model<PacienteCreationAttributes> {
    public id!: number;
    public nome!: string;
    public cpf!: string;
    public dataNascimento!: Date;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Inicializar o modelo com os atributos e configurações
PacienteModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^\d{11}$/,
                notNull: { msg: "CPF é obrigatório" },
            },
        },
        dataNascimento: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Paciente',
    }
);

export default PacienteModel;
