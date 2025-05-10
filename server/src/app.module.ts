import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HaravanModule } from './haravan/haravan.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HaravanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
