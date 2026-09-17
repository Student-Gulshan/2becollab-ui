import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ContractsModule } from '../contracts/contracts.module';

@Module({
  imports: [PrismaModule, ContractsModule],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService],
})
export class OffersModule {}
