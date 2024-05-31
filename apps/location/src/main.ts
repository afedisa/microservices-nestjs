import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { LocationModule } from './location.module';

async function bootstrap() {
  const app = await NestFactory.create(LocationModule);

  // * setup
  app.connectMicroservice<MicroserviceOptions>(
    app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS),
  );

  // * start
  await app.startAllMicroservices();
}
bootstrap();
