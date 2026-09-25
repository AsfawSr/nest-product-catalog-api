import 'reflect-metadata';
import 'dotenv/config';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { ProductOrmEntity } from '../products/infrastructure/persistence/product.orm-entity.js';
import { UserOrmEntity } from '../auth/entities/user.orm-entity.js';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Asfawpassword',
  database: process.env.DB_NAME || 'nest_products',
  entities: [ProductOrmEntity, UserOrmEntity],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
