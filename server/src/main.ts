import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { connectRedis } from './utils/redis.util';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);  
  app.enableCors({     
    credentials: true,
    origin: config.get('FRONTEND_URL'),
  }); 
  app.use(cookieParser()); 
  app.setGlobalPrefix('api');
  const PORT = config.get('PORT') || 3001;
  
  await connectRedis();
  await app.listen(PORT, () => console.log('App listen on ' + PORT));
}
bootstrap(); 
