import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  // somewhere in your initialization file
  app.use(
    session({
      secret: 'mock-backend-session',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 36000000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('The Blog API description')
    .setVersion('1.0')
    .addTag('Blog Backend')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //   app.useLogger(app.get(MyLogger));
  await app.listen(3200);
  console.log(`Nest application is listening on ${3200}`);
}
bootstrap();
