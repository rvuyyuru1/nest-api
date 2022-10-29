import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as hpp from 'hpp';
import * as compress from 'compression';
async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    // logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    // autoFlushLogs: true,
    // bodyParser: true,
    cors: {
      origin: '*',
      credentials: true,
    },
  });
  initMiddleware(app);
}
async function initMiddleware(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );
  app.use(helmet());
  app.use(hpp());
  app.use(compress());
  await app.listen(parseInt(process.env.PORT) || 2000);
}
bootstrap();
