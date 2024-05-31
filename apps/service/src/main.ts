import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { ServiceModule } from './service.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceModule);

  // * setup
  app.connectMicroservice<MicroserviceOptions>(
    app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS),
  );

  // * start
  await app.startAllMicroservices();
}
bootstrap();
