import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContractsService } from '../contracts/contracts.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CounterOfferDto } from './dto/counter-offer.dto';
import { OfferResponse, OfferStatus, UserRole } from '@2becollab/types';

@Injectable()
export class OffersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contractsService: ContractsService,
  ) {}

  async createOffer(userId: string, dto: CreateOfferDto): Promise<OfferResponse> {
    // Verify recipient exists
    const recipient = await this.prisma.user.findUnique({
      where: { id: dto.recipientId },
    });
    if (!recipient) {
      throw new NotFoundException('Recipient user not found');
    }

    // Verify creator profile exists
    const creatorProfile = await this.prisma.creatorProfile.findUnique({
      where: { id: dto.creatorProfileId },
    });
    if (!creatorProfile) {
      throw new NotFoundException('Creator profile not found');
    }

    const offer = await this.prisma.offer.create({
      data: {
        senderId: userId,
        recipientId: dto.recipientId,
        creatorProfileId: dto.creatorProfileId,
        campaignId: dto.campaignId,
        title: dto.title,
        description: dto.description,
        price: dto.price,
        currency: dto.currency || 'USD',
        deliverables: dto.deliverables as any,
        revisionLimit: dto.revisionLimit ?? 2,
        deadline: new Date(dto.deadline),
        usageRights: dto.usageRights,
        exclusivityDays: dto.exclusivityDays,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        status: OfferStatus.PENDING,
      },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true, role: true },
        },
        recipient: {
          select: { id: true, fullName: true, avatarUrl: true, role: true },
        },
        creatorProfile: {
          include: {
            user: {
              select: { fullName: true, avatarUrl: true },
            },
          },
        },
        campaign: {
          select: { id: true, title: true },
        },
        contract: {
          select: { id: true, contractNumber: true, status: true },
        },
      },
    });

    return this.serializeOffer(offer);
  }

  async counterOffer(
    userId: string,
    offerId: string,
    dto: CounterOfferDto,
  ): Promise<OfferResponse> {
    const parentOffer = await this.prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!parentOffer) {
      throw new NotFoundException('Offer not found');
    }

    if (parentOffer.recipientId !== userId) {
      throw new ForbiddenException('Only the recipient can make a counter-offer');
    }

    if (parentOffer.status !== OfferStatus.PENDING) {
      throw new BadRequestException('Can only counter an active pending offer');
    }

    // Mark parent offer as COUNTERED
    await this.prisma.offer.update({
      where: { id: offerId },
      data: { status: OfferStatus.COUNTERED },
    });

    // Create counter-offer swapping sender and recipient
    const counterOffer = await this.prisma.offer.create({
      data: {
        senderId: userId,
        recipientId: parentOffer.senderId,
        creatorProfileId: parentOffer.creatorProfileId,
        campaignId: parentOffer.campaignId,
        title: `Counter: ${parentOffer.title}`,
        description: parentOffer.description,
        price: dto.price !== undefined ? dto.price : parentOffer.price,
        currency: parentOffer.currency,
        deliverables: (dto.deliverables as any) || parentOffer.deliverables,
        revisionLimit: dto.revisionLimit !== undefined ? dto.revisionLimit : parentOffer.revisionLimit,
        deadline: dto.deadline ? new Date(dto.deadline) : parentOffer.deadline,
        usageRights: dto.usageRights !== undefined ? dto.usageRights : parentOffer.usageRights,
        exclusivityDays: dto.exclusivityDays !== undefined ? dto.exclusivityDays : parentOffer.exclusivityDays,
        parentOfferId: parentOffer.id,
        counterReason: dto.counterReason,
        status: OfferStatus.PENDING,
      },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true, role: true },
        },
        recipient: {
          select: { id: true, fullName: true, avatarUrl: true, role: true },
        },
        creatorProfile: {
          include: {
            user: {
              select: { fullName: true, avatarUrl: true },
            },
          },
        },
        campaign: {
          select: { id: true, title: true },
        },
        contract: {
          select: { id: true, contractNumber: true, status: true },
        },
        parentOffer: {
          select: { id: true, price: true, status: true, title: true },
        },
      },
    });

    return this.serializeOffer(counterOffer);
  }

  async respondOffer(
    userId: string,
    offerId: string,
    action: 'ACCEPT' | 'REJECT' | 'WITHDRAW',
  ): Promise<{ offer: OfferResponse; contract?: any }> {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (action === 'WITHDRAW') {
      if (offer.senderId !== userId) {
        throw new ForbiddenException('Only the sender can withdraw an offer');
      }
      if (offer.status !== OfferStatus.PENDING) {
        throw new BadRequestException('Can only withdraw pending offers');
      }

      const updated = await this.prisma.offer.update({
        where: { id: offerId },
        data: { status: OfferStatus.WITHDRAWN },
        include: {
          sender: { select: { id: true, fullName: true, avatarUrl: true, role: true } },
          recipient: { select: { id: true, fullName: true, avatarUrl: true, role: true } },
          creatorProfile: { include: { user: { select: { fullName: true, avatarUrl: true } } } },
          campaign: { select: { id: true, title: true } },
          contract: { select: { id: true, contractNumber: true, status: true } },
        },
      });

      return { offer: this.serializeOffer(updated) };
    }

    if (action === 'REJECT') {
      if (offer.recipientId !== userId) {
        throw new ForbiddenException('Only the recipient can reject an offer');
      }
      if (offer.status !== OfferStatus.PENDING) {
        throw new BadRequestException('Can only reject pending offers');
      }

      const updated = await this.prisma.offer.update({
        where: { id: offerId },
        data: { status: OfferStatus.REJECTED },
        include: {
          sender: { select: { id: true, fullName: true, avatarUrl: true, role: true } },
          recipient: { select: { id: true, fullName: true, avatarUrl: true, role: true } },
          creatorProfile: { include: { user: { select: { fullName: true, avatarUrl: true } } } },
          campaign: { select: { id: true, title: true } },
          contract: { select: { id: true, contractNumber: true, status: true } },
        },
      });

      return { offer: this.serializeOffer(updated) };
    }

    if (action === 'ACCEPT') {
      if (offer.recipientId !== userId) {
        throw new ForbiddenException('Only the recipient can accept an offer');
      }
      if (offer.status !== OfferStatus.PENDING) {
        throw new BadRequestException('Can only accept pending offers');
      }

      const updated = await this.prisma.offer.update({
        where: { id: offerId },
        data: { status: OfferStatus.ACCEPTED },
        include: {
          sender: { select: { id: true, fullName: true, avatarUrl: true, role: true } },
          recipient: { select: { id: true, fullName: true, avatarUrl: true, role: true } },
          creatorProfile: { include: { user: { select: { fullName: true, avatarUrl: true } } } },
          campaign: { select: { id: true, title: true } },
        },
      });

      // Automatically generate binding contract snapshot (Chunk 11)
      const contract = await this.contractsService.createContractFromOffer(offerId);

      return {
        offer: this.serializeOffer({ ...updated, contract }),
        contract,
      };
    }

    throw new BadRequestException('Invalid action');
  }

  async getUserOffers(
    userId: string,
    type?: 'received' | 'sent',
  ): Promise<OfferResponse[]> {
    const where: any = {};
    if (type === 'received') {
      where.recipientId = userId;
    } else if (type === 'sent') {
      where.senderId = userId;
    } else {
      where.OR = [{ senderId: userId }, { recipientId: userId }];
    }

    const offers = await this.prisma.offer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true, role: true },
        },
        recipient: {
          select: { id: true, fullName: true, avatarUrl: true, role: true },
        },
        creatorProfile: {
          include: {
            user: {
              select: { fullName: true, avatarUrl: true },
            },
          },
        },
        campaign: {
          select: { id: true, title: true },
        },
        contract: {
          select: { id: true, contractNumber: true, status: true },
        },
        parentOffer: {
          select: { id: true, price: true, status: true, title: true },
        },
      },
    });

    return offers.map((o: any) => this.serializeOffer(o));
  }

  async getOfferById(offerId: string, userId: string): Promise<OfferResponse> {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true, role: true },
        },
        recipient: {
          select: { id: true, fullName: true, avatarUrl: true, role: true },
        },
        creatorProfile: {
          include: {
            user: {
              select: { fullName: true, avatarUrl: true },
            },
          },
        },
        campaign: {
          select: { id: true, title: true },
        },
        contract: {
          select: { id: true, contractNumber: true, status: true },
        },
        parentOffer: {
          select: { id: true, price: true, status: true, title: true },
        },
        counterOffers: {
          select: { id: true, price: true, status: true, title: true, createdAt: true },
        },
      },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (offer.senderId !== userId && offer.recipientId !== userId) {
      throw new ForbiddenException('You do not have permission to view this offer');
    }

    return this.serializeOffer(offer);
  }

  serializeOffer(o: any): OfferResponse {
    return {
      id: o.id,
      senderId: o.senderId,
      recipientId: o.recipientId,
      creatorProfileId: o.creatorProfileId,
      campaignId: o.campaignId,
      title: o.title,
      description: o.description,
      price: o.price,
      currency: o.currency,
      deliverables: (o.deliverables as any) || [],
      revisionLimit: o.revisionLimit,
      deadline: o.deadline.toISOString(),
      usageRights: o.usageRights,
      exclusivityDays: o.exclusivityDays,
      parentOfferId: o.parentOfferId,
      counterReason: o.counterReason,
      status: o.status as OfferStatus,
      expiresAt: o.expiresAt?.toISOString() ?? null,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      sender: o.sender,
      recipient: o.recipient,
      creatorProfile: o.creatorProfile,
      campaign: o.campaign,
      contract: o.contract,
      parentOffer: o.parentOffer,
    };
  }
}
