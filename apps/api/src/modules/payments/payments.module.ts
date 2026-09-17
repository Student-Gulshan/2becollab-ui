import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ContractsModule } from '../contracts/contracts.module';

@Module({
  imports: [PrismaModule, ContractsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
