import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { AppModule } from '../src/app.module';

export async function createTestingApp(): Promise<INestApplication> {
  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          driver: PostgreSqlDriver,
          host: process.env.DB_HOST || 'localhost',
          port: 5432,
          user: 'myuser',
          password: 'mypassword',
          dbName: 'mydatabase',
          entities: ['./dist/entities/*.js'],
          allowGlobalContext: true,
          debug: true,
          driverOptions: {
            connection: { ssl: false },
          },
          schemaGenerator: {
            createForeignKeyConstraints: true,
            disableForeignKeys: false,
          },
        }),
        AppModule,
      ],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();
    return app;
  } catch (error) {
    console.error('Failed to create testing app:', error);
    throw error;
  }
}

export async function clearDatabase(app: INestApplication) {
  try {
    const orm = app.get('MikroORM');
    const generator = orm.getSchemaGenerator();
    await generator.refreshDatabase();
  } catch (error) {
    console.error('Failed to clear database:', error);
    throw error;
  }
}
