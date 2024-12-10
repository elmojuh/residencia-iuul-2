import sequelize from '../config/database';
import Paciente from './PacienteModel';
import Consulta from './ConsultaModel';

const models = {
    Paciente,
    Consulta,
};

Object.values(models).forEach((model) => {
    if ('associate' in model) {
        (model as any).associate(models);
    }
});

export default models;
export { sequelize };
