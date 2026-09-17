import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ContractStatus,
  ContractResponse,
  ContractTermsSnapshot,
  UserRole,
} from '@2becollab/types';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async createContractFromOffer(offerId: string): Promise<ContractResponse> {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        sender: {
          include: { businessProfile: true, creatorProfile: true },
        },
        recipient: {
          include: { businessProfile: true, creatorProfile: true },
        },
        creatorProfile: {
          include: { user: true },
        },
        campaign: true,
        contract: true,
      },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (offer.contract) {
      return this.serializeContract(offer.contract);
    }

    if (offer.status !== 'ACCEPTED') {
      throw new BadRequestException('Contract can only be created from an accepted offer');
    }

    // Determine business party and creator party
    // One is sender, one is recipient
    let businessUser = offer.sender.role === UserRole.BUSINESS ? offer.sender : offer.recipient;
    let creatorUser = offer.creatorProfile.user;

    const platformFee = Math.round(offer.price * 0.10 * 100) / 100; // 10% platform fee
    const creatorEarnings = Math.round((offer.price - platformFee) * 100) / 100;

    const year = new Date().getFullYear();
    const randSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const contractNumber = `CTR-${year}-${randSuffix}`;

    const termsSnapshot: ContractTermsSnapshot = {
      title: offer.title,
      agreedPrice: offer.price,
      platformFee,
      creatorEarnings,
      currency: offer.currency,
      deadline: offer.deadline.toISOString(),
      revisionLimit: offer.revisionLimit,
      usageRights: offer.usageRights,
      exclusivityDays: offer.exclusivityDays,
      deliverables: (offer.deliverables as any) || [],
      business: {
        id: businessUser.id,
        fullName: businessUser.fullName,
        avatarUrl: businessUser.avatarUrl,
        companyName: businessUser.businessProfile?.companyName,
      },
      creator: {
        id: creatorUser.id,
        profileId: offer.creatorProfileId,
        fullName: creatorUser.fullName,
        avatarUrl: creatorUser.avatarUrl,
        headline: offer.creatorProfile.headline,
      },
      campaign: offer.campaign ? { id: offer.campaign.id, title: offer.campaign.title } : null,
      acceptedAt: new Date().toISOString(),
    };

    const contract = await this.prisma.contract.create({
      data: {
        contractNumber,
        offerId: offer.id,
        businessId: businessUser.id,
        creatorId: creatorUser.id,
        creatorProfileId: offer.creatorProfileId,
        campaignId: offer.campaignId,
        title: offer.title,
        totalAmount: offer.price,
        platformFee,
        creatorEarnings,
        currency: offer.currency,
        termsSnapshot: termsSnapshot as any,
        status: ContractStatus.PENDING_PAYMENT,
        dueDate: offer.deadline,
      },
      include: {
        business: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        creator: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        campaign: {
          select: { id: true, title: true },
        },
        escrowTransactions: true,
      },
    });

    return this.serializeContract(contract);
  }

  async getContracts(
    userId: string,
    status?: ContractStatus,
  ): Promise<ContractResponse[]> {
    const where: any = {
      OR: [{ businessId: userId }, { creatorId: userId }],
    };

    if (status) {
      where.status = status;
    }

    const contracts = await this.prisma.contract.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        business: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        creator: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        campaign: {
          select: { id: true, title: true },
        },
        escrowTransactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return contracts.map((c: any) => this.serializeContract(c));
  }

  async getContractById(contractId: string, userId: string): Promise<ContractResponse> {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        business: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        creator: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        campaign: {
          select: { id: true, title: true },
        },
        escrowTransactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.businessId !== userId && contract.creatorId !== userId) {
      throw new ForbiddenException('You do not have permission to view this contract');
    }

    return this.serializeContract(contract);
  }

  async updateContractStatus(
    contractId: string,
    userId: string,
    status: ContractStatus,
  ): Promise<ContractResponse> {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.businessId !== userId && contract.creatorId !== userId) {
      throw new ForbiddenException('Not authorized to update this contract');
    }

    const data: any = { status };
    if (status === ContractStatus.COMPLETED) {
      data.completedAt = new Date();
    } else if (status === ContractStatus.CANCELLED) {
      data.cancelledAt = new Date();
    }

    const updated = await this.prisma.contract.update({
      where: { id: contractId },
      data,
      include: {
        business: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        creator: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        campaign: {
          select: { id: true, title: true },
        },
        escrowTransactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return this.serializeContract(updated);
  }

  serializeContract(c: any): ContractResponse {
    return {
      id: c.id,
      contractNumber: c.contractNumber,
      offerId: c.offerId,
      businessId: c.businessId,
      creatorId: c.creatorId,
      creatorProfileId: c.creatorProfileId,
      campaignId: c.campaignId,
      title: c.title,
      totalAmount: c.totalAmount,
      platformFee: c.platformFee,
      creatorEarnings: c.creatorEarnings,
      currency: c.currency,
      termsSnapshot: c.termsSnapshot as ContractTermsSnapshot,
      status: c.status as ContractStatus,
      startDate: c.startDate?.toISOString() ?? null,
      dueDate: c.dueDate.toISOString(),
      completedAt: c.completedAt?.toISOString() ?? null,
      cancelledAt: c.cancelledAt?.toISOString() ?? null,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      business: c.business,
      creator: c.creator,
      campaign: c.campaign,
      escrowTransactions: c.escrowTransactions?.map((e: any) => ({
        id: e.id,
        contractId: e.contractId,
        payerId: e.payerId,
        recipientId: e.recipientId,
        amount: e.amount,
        platformFee: e.platformFee,
        creatorAmount: e.creatorAmount,
        currency: e.currency,
        status: e.status,
        paymentProvider: e.paymentProvider,
        providerTransactionId: e.providerTransactionId,
        idempotencyKey: e.idempotencyKey,
        paidAt: e.paidAt?.toISOString() ?? null,
        releasedAt: e.releasedAt?.toISOString() ?? null,
        refundedAt: e.refundedAt?.toISOString() ?? null,
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      })),
    };
  }
}
