import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransfromInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransfromInterceptor());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Task Management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)
  await app.listen(3000);
}
bootstrap();
