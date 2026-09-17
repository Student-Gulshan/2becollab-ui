import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import {
  CheckoutSessionResponse,
  EscrowStatus,
  EscrowTransactionResponse,
  ContractStatus,
} from '@2becollab/types';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createCheckoutSession(
    contractId: string,
    userId: string,
    dto: CreateCheckoutDto,
  ): Promise<CheckoutSessionResponse> {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.businessId !== userId) {
      throw new ForbiddenException('Only the hiring business can fund escrow for this contract');
    }

    if (contract.status !== ContractStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        `Contract is already in ${contract.status} status and does not require escrow funding`,
      );
    }

    const sessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `escrow_${contract.id}_${Date.now()}`;

    // Create pending escrow transaction record
    await this.prisma.escrowTransaction.create({
      data: {
        contractId: contract.id,
        payerId: contract.businessId,
        recipientId: contract.creatorId,
        amount: contract.totalAmount,
        platformFee: contract.platformFee,
        creatorAmount: contract.creatorEarnings,
        currency: contract.currency,
        status: EscrowStatus.PENDING,
        paymentProvider: dto.paymentMethod || 'STRIPE_MOCK',
        idempotencyKey,
      },
    });

    return {
      sessionId,
      contractId: contract.id,
      amount: contract.totalAmount,
      platformFee: contract.platformFee,
      totalDue: contract.totalAmount,
      currency: contract.currency,
      clientSecret: `pi_mock_secret_${sessionId}`,
      paymentUrl: `/contracts/${contract.id}?checkout=true&session=${sessionId}`,
    };
  }

  async confirmPayment(
    contractId: string,
    userId: string,
    dto: ConfirmPaymentDto,
  ): Promise<{ contract: any; escrow: EscrowTransactionResponse }> {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.businessId !== userId) {
      throw new ForbiddenException('Only the hiring business can confirm payment for this contract');
    }

    // Find latest pending escrow transaction
    const pendingTxn = await this.prisma.escrowTransaction.findFirst({
      where: {
        contractId,
        status: EscrowStatus.PENDING,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!pendingTxn) {
      throw new BadRequestException('No pending escrow checkout session found for this contract');
    }

    // Mark escrow transaction as HELD
    const updatedTxn = await this.prisma.escrowTransaction.update({
      where: { id: pendingTxn.id },
      data: {
        status: EscrowStatus.HELD,
        paidAt: new Date(),
        providerTransactionId: dto.providerPaymentId || `ch_mock_${Date.now()}`,
      },
    });

    // Activate the contract
    const updatedContract = await this.prisma.contract.update({
      where: { id: contractId },
      data: {
        status: ContractStatus.ACTIVE,
        startDate: new Date(),
      },
      include: {
        business: { select: { id: true, fullName: true, avatarUrl: true } },
        creator: { select: { id: true, fullName: true, avatarUrl: true } },
        campaign: { select: { id: true, title: true } },
      },
    });

    return {
      contract: updatedContract,
      escrow: this.serializeEscrow(updatedTxn),
    };
  }

  async getContractEscrow(
    contractId: string,
    userId: string,
  ): Promise<EscrowTransactionResponse | null> {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.businessId !== userId && contract.creatorId !== userId) {
      throw new ForbiddenException('Not authorized to view escrow for this contract');
    }

    const txn = await this.prisma.escrowTransaction.findFirst({
      where: { contractId },
      orderBy: { createdAt: 'desc' },
    });

    return txn ? this.serializeEscrow(txn) : null;
  }

  async releaseEscrow(
    contractId: string,
    userId: string,
  ): Promise<EscrowTransactionResponse> {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.businessId !== userId) {
      throw new ForbiddenException('Only the business can authorize escrow release upon deliverable approval');
    }

    const txn = await this.prisma.escrowTransaction.findFirst({
      where: { contractId, status: EscrowStatus.HELD },
    });

    if (!txn) {
      throw new BadRequestException('No held escrow funds found for this contract');
    }

    const updatedTxn = await this.prisma.escrowTransaction.update({
      where: { id: txn.id },
      data: {
        status: EscrowStatus.RELEASED,
        releasedAt: new Date(),
      },
    });

    await this.prisma.contract.update({
      where: { id: contractId },
      data: {
        status: ContractStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    return this.serializeEscrow(updatedTxn);
  }

  async refundEscrow(
    contractId: string,
    userId: string,
  ): Promise<EscrowTransactionResponse> {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.businessId !== userId) {
      throw new ForbiddenException('Only the business or admin can refund escrow');
    }

    const txn = await this.prisma.escrowTransaction.findFirst({
      where: { contractId, status: EscrowStatus.HELD },
    });

    if (!txn) {
      throw new BadRequestException('No held escrow funds available to refund');
    }

    const updatedTxn = await this.prisma.escrowTransaction.update({
      where: { id: txn.id },
      data: {
        status: EscrowStatus.REFUNDED,
        refundedAt: new Date(),
      },
    });

    await this.prisma.contract.update({
      where: { id: contractId },
      data: {
        status: ContractStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    return this.serializeEscrow(updatedTxn);
  }

  serializeEscrow(e: any): EscrowTransactionResponse {
    return {
      id: e.id,
      contractId: e.contractId,
      payerId: e.payerId,
      recipientId: e.recipientId,
      amount: e.amount,
      platformFee: e.platformFee,
      creatorAmount: e.creatorAmount,
      currency: e.currency,
      status: e.status as EscrowStatus,
      paymentProvider: e.paymentProvider,
      providerTransactionId: e.providerTransactionId,
      idempotencyKey: e.idempotencyKey,
      paidAt: e.paidAt?.toISOString() ?? null,
      releasedAt: e.releasedAt?.toISOString() ?? null,
      refundedAt: e.refundedAt?.toISOString() ?? null,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    };
  }
}
