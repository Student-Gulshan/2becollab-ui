import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaymentsService } from './payments.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import {
  CheckoutSessionResponse,
  EscrowTransactionResponse,
} from '@2becollab/types';

@Controller('contracts/:contractId/payment')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async getEscrowStatus(
    @Param('contractId') contractId: string,
    @CurrentUser('id') userId: string,
  ): Promise<EscrowTransactionResponse | null> {
    return this.paymentsService.getContractEscrow(contractId, userId);
  }

  @Post('checkout')
  async createCheckout(
    @Param('contractId') contractId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCheckoutDto,
  ): Promise<CheckoutSessionResponse> {
    return this.paymentsService.createCheckoutSession(contractId, userId, dto);
  }

  @Post('confirm')
  async confirmPayment(
    @Param('contractId') contractId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ConfirmPaymentDto,
  ): Promise<{ contract: any; escrow: EscrowTransactionResponse }> {
    return this.paymentsService.confirmPayment(contractId, userId, dto);
  }

  @Post('release')
  async releaseEscrow(
    @Param('contractId') contractId: string,
    @CurrentUser('id') userId: string,
  ): Promise<EscrowTransactionResponse> {
    return this.paymentsService.releaseEscrow(contractId, userId);
  }

  @Post('refund')
  async refundEscrow(
    @Param('contractId') contractId: string,
    @CurrentUser('id') userId: string,
  ): Promise<EscrowTransactionResponse> {
    return this.paymentsService.refundEscrow(contractId, userId);
  }
}
