import { Module } from '@nestjs/common';
import { HaravanController } from './haravan.controller';
import { HaravanService } from './haravan.service';
import { HaravanRepository } from './haravan.repository';

@Module({
  controllers: [HaravanController],
  providers: [HaravanService, HaravanRepository],
})
export class HaravanModule {}
