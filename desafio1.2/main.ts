import sequelize from './config/database';
import { InterfaceMenu } from './views/InterfaceMenu';
import { PacienteRepository } from './repositories/PacienteRepository';
import { ConsultaRepository } from './repositories/ConsultaRepository';
import { PacienteService } from './services/PacienteService';
import { ConsultaService } from './services/ConsultaService';
import { InterfaceAPI } from './views/InterfaceAPI';

async function main() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ force: true }); // Use { force: true } only for development
        console.log('Database synchronized.');

        const pacienteRepository = new PacienteRepository();
        const consultaRepository = new ConsultaRepository();
        const pacienteService = new PacienteService(pacienteRepository);
        const agendaService = new ConsultaService(consultaRepository, pacienteService);
        const interfaceAPI = new InterfaceAPI();

        const application = new InterfaceMenu(pacienteService, agendaService, interfaceAPI);
        application.menuPrincipal();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

main();
