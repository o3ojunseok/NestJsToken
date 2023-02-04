import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, // entity 데코레이터 없는 값 넣으면 에러메세지
      transform: true, // controller가 값을 받을 때 controller에 정의한 타입으로 형변환
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,POST,PUT,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
