import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { AppConfig } from './common/config/app.config';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*', credentials: true });
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.enableVersioning({ type: VersioningType.URI });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      skipUndefinedProperties: false,
      transformOptions: {
        exposeDefaultValues: true,
        exposeUnsetFields: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJs Redis Auction App')
    .setDescription('NestJs Redis Auction App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = Number(app.get(ConfigService<AppConfig>).get('port'));

  await app.listen(port);
}
bootstrap();
