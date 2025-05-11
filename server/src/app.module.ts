import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HaravanModule } from './haravan/haravan.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetafieldsModule } from './metafields/metafields.module';
import { TokenModule } from './common/token/token.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HaravanModule, MetafieldsModule, TokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
