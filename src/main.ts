import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as hpp from 'hpp';
import * as compress from 'compression';
import { PORT } from './config/config';
import { INestApplication } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initMiddleware(app);
}

async function initMiddleware(app: INestApplication) {
  app.enableCors();
  app.use(helmet());
  app.use(hpp());
  app.use(compress());
  await app.listen(parseInt(PORT) || 2000);
}
bootstrap();
