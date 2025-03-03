import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Blockchain Price Tracker API')
    .setDescription(
      'API documentation for the Blockchain Price Tracker service',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //
  console.log('Nest.js app starting on ', process.env.PORT);
  await app.listen(process.env.PORT);
}
bootstrap();
