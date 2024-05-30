import { NestFactory } from '@nestjs/core';
import { TurnModule } from './turn.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';

async function bootstrap() {
  const app = await NestFactory.create(TurnModule);

  // * setup
  app.connectMicroservice<MicroserviceOptions>(
    app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS),
  );

  // * start
  await app.startAllMicroservices();
}
bootstrap();
