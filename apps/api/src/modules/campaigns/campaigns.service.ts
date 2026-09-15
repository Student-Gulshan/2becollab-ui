import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { FilterCampaignDto } from './dto/filter-campaign.dto';
import { CampaignStatus } from '@2becollab/types';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getBusinessProfile(userId: string) {
    let profile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Auto-create shell business profile if not found
      profile = await this.prisma.businessProfile.create({
        data: { userId },
      });
    }

    return profile;
  }

  async create(userId: string, dto: CreateCampaignDto) {
    const business = await this.getBusinessProfile(userId);

    const campaign = await this.prisma.campaign.create({
      data: {
        businessProfileId: business.id,
        title: dto.title,
        description: dto.description,
        coverImageUrl: dto.coverImageUrl || null,
        niches: dto.niches || [],
        platforms: (dto.platforms as any) || [],
        budgetMin: dto.budgetMin !== undefined ? Number(dto.budgetMin) : null,
        budgetMax: dto.budgetMax !== undefined ? Number(dto.budgetMax) : null,
        currency: dto.currency || 'USD',
        deliverables: (dto.deliverables as any) || null,
        targetAudience: dto.targetAudience || null,
        requirements: dto.requirements || null,
        location: dto.location || null,
        deadline: dto.deadline ? new Date(dto.deadline) : null,
        status: (dto.status as any) || CampaignStatus.ACTIVE,
      },
      include: {
        businessProfile: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return this.serializeCampaign(campaign);
  }

  async findMyCampaigns(userId: string, status?: CampaignStatus) {
    const business = await this.getBusinessProfile(userId);

    const where: any = {
      businessProfileId: business.id,
    };

    if (status) {
      where.status = status;
    }

    const campaigns = await this.prisma.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        businessProfile: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return campaigns.map((c) => this.serializeCampaign(c));
  }

  async findPublicCampaigns(dto: FilterCampaignDto) {
    const page = Math.max(1, Number(dto.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(dto.limit) || 12));
    const skip = (page - 1) * limit;

    const where: any = {
      status: dto.status || CampaignStatus.ACTIVE,
    };

    if (dto.query?.trim()) {
      const q = dto.query.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { requirements: { contains: q, mode: 'insensitive' } },
        { targetAudience: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (dto.niche?.trim()) {
      where.niches = {
        has: dto.niche.trim(),
      };
    }

    if (dto.platform) {
      where.platforms = {
        has: dto.platform as any,
      };
    }

    if (dto.minBudget !== undefined) {
      where.budgetMax = {
        gte: Number(dto.minBudget),
      };
    }

    if (dto.maxBudget !== undefined) {
      where.budgetMin = {
        lte: Number(dto.maxBudget),
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (dto.sortBy === 'budget') {
      orderBy = { budgetMax: dto.sortOrder || 'desc' };
    } else if (dto.sortBy === 'deadline') {
      orderBy = { deadline: dto.sortOrder || 'asc' };
    } else if (dto.sortBy === 'newest') {
      orderBy = { createdAt: dto.sortOrder || 'desc' };
    }

    const [total, campaigns] = await Promise.all([
      this.prisma.campaign.count({ where }),
      this.prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          businessProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: campaigns.map((c) => this.serializeCampaign(c)),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        businessProfile: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return this.serializeCampaign(campaign);
  }

  async update(userId: string, id: string, dto: UpdateCampaignDto) {
    const business = await this.getBusinessProfile(userId);

    const existing = await this.prisma.campaign.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Campaign not found');
    }

    if (existing.businessProfileId !== business.id) {
      throw new ForbiddenException('You are not authorized to modify this campaign');
    }

    const updated = await this.prisma.campaign.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.coverImageUrl !== undefined ? { coverImageUrl: dto.coverImageUrl || null } : {}),
        ...(dto.niches !== undefined ? { niches: dto.niches } : {}),
        ...(dto.platforms !== undefined ? { platforms: dto.platforms as any } : {}),
        ...(dto.budgetMin !== undefined ? { budgetMin: Number(dto.budgetMin) } : {}),
        ...(dto.budgetMax !== undefined ? { budgetMax: Number(dto.budgetMax) } : {}),
        ...(dto.currency !== undefined ? { currency: dto.currency } : {}),
        ...(dto.deliverables !== undefined ? { deliverables: dto.deliverables as any } : {}),
        ...(dto.targetAudience !== undefined ? { targetAudience: dto.targetAudience || null } : {}),
        ...(dto.requirements !== undefined ? { requirements: dto.requirements || null } : {}),
        ...(dto.location !== undefined ? { location: dto.location || null } : {}),
        ...(dto.deadline !== undefined ? { deadline: dto.deadline ? new Date(dto.deadline) : null } : {}),
        ...(dto.status !== undefined ? { status: dto.status as any } : {}),
      },
      include: {
        businessProfile: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return this.serializeCampaign(updated);
  }

  async remove(userId: string, id: string) {
    const business = await this.getBusinessProfile(userId);

    const existing = await this.prisma.campaign.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Campaign not found');
    }

    if (existing.businessProfileId !== business.id) {
      throw new ForbiddenException('You are not authorized to delete this campaign');
    }

    await this.prisma.campaign.delete({
      where: { id },
    });

    return { message: 'Campaign deleted successfully' };
  }

  private serializeCampaign(c: any) {
    return {
      id: c.id,
      businessProfileId: c.businessProfileId,
      title: c.title,
      description: c.description,
      coverImageUrl: c.coverImageUrl,
      niches: c.niches,
      platforms: c.platforms,
      budgetMin: c.budgetMin,
      budgetMax: c.budgetMax,
      currency: c.currency,
      deliverables: c.deliverables,
      targetAudience: c.targetAudience,
      requirements: c.requirements,
      location: c.location,
      deadline: c.deadline ? c.deadline.toISOString() : null,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      businessProfile: c.businessProfile
        ? {
            id: c.businessProfile.id,
            userId: c.businessProfile.userId,
            companyName: c.businessProfile.companyName,
            industry: c.businessProfile.industry,
            logoUrl: c.businessProfile.logoUrl,
            location: c.businessProfile.location,
            websiteUrl: c.businessProfile.websiteUrl,
            user: c.businessProfile.user || null,
          }
        : undefined,
    };
  }
}
