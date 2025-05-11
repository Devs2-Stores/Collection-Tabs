import { Module } from '@nestjs/common';
import { MetafieldsController } from './metafields.controller';
import { MetafieldsService } from './metafields.service';
import { TokenModule } from 'src/common/token/token.module';
import { ShopAuthGuard } from 'src/common/guards/shop-auth.guard';
import { HaravanModule } from 'src/haravan/haravan.module';

@Module({
  imports: [TokenModule, HaravanModule],
  controllers: [MetafieldsController],
  providers: [MetafieldsService]
})
export class MetafieldsModule {}
