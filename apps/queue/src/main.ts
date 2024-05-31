import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { QueueModule } from './queue.module';

async function bootstrap() {
  const app = await NestFactory.create(QueueModule);

  // * setup
  app.connectMicroservice<MicroserviceOptions>(
    app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS),
  );

  // * start
  await app.startAllMicroservices();
}
bootstrap();
