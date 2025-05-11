import { Module } from '@nestjs/common';
import { HaravanController } from './haravan.controller';
import { HaravanService } from './haravan.service';
import { HaravanRepository } from './haravan.repository';
import { TokenModule } from 'src/common/token/token.module';

@Module({
  imports: [TokenModule],
  controllers: [HaravanController],
  providers: [HaravanService, HaravanRepository],
  exports: [HaravanService],
})
export class HaravanModule {}
