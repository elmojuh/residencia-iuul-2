import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('consultorio', 'cumesbr', 'jardineiros.2024', {
    host: 'localhost',
    dialect: 'postgres',
});

export default sequelize;
