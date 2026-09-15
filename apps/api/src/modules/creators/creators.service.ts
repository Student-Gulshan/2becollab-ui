import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCreatorProfileDto } from './dto/update-creator-profile.dto';

@Injectable()
export class CreatorsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    let profile = await this.prisma.creatorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!profile) {
      // Auto-create initial profile shell if missing
      profile = await this.prisma.creatorProfile.create({
        data: { userId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });
    }

    return this.serializeProfile(profile);
  }

  async updateProfile(userId: string, dto: UpdateCreatorProfileDto) {
    // Ensure profile exists
    await this.getProfile(userId);

    const updated = await this.prisma.creatorProfile.update({
      where: { userId },
      data: {
        ...(dto.headline !== undefined ? { headline: dto.headline } : {}),
        ...(dto.bio !== undefined ? { bio: dto.bio } : {}),
        ...(dto.niche !== undefined ? { niche: dto.niche } : {}),
        ...(dto.location !== undefined ? { location: dto.location } : {}),
        ...(dto.languages !== undefined ? { languages: dto.languages } : {}),
        ...(dto.websiteUrl !== undefined ? { websiteUrl: dto.websiteUrl || null } : {}),
        ...(dto.coverImageUrl !== undefined ? { coverImageUrl: dto.coverImageUrl || null } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return this.serializeProfile(updated);
  }

  async getPublicProfile(idOrUserId: string) {
    const profile = await this.prisma.creatorProfile.findFirst({
      where: {
        OR: [{ id: idOrUserId }, { userId: idOrUserId }],
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        socialAccounts: {
          orderBy: { createdAt: 'asc' },
        },
        portfolioItems: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Creator profile not found');
    }

    return this.serializeProfile(profile);
  }

  private serializeProfile(profile: any) {
    const result: any = {
      id: profile.id,
      userId: profile.userId,
      headline: profile.headline,
      bio: profile.bio,
      niche: profile.niche,
      location: profile.location,
      languages: profile.languages,
      websiteUrl: profile.websiteUrl,
      coverImageUrl: profile.coverImageUrl,
      isVerified: profile.isVerified,
      ratingAverage: profile.ratingAverage,
      reviewCount: profile.reviewCount,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
      user: profile.user || null,
    };

    // Include social accounts if loaded
    if (profile.socialAccounts) {
      result.socialAccounts = profile.socialAccounts.map((a: any) => ({
        id: a.id,
        creatorProfileId: a.creatorProfileId,
        platform: a.platform,
        handle: a.handle,
        profileUrl: a.profileUrl,
        followerCount: a.followerCount,
        engagementRate: a.engagementRate,
        isVerified: a.isVerified,
        lastSyncedAt: a.lastSyncedAt?.toISOString() ?? null,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      }));
    }

    // Include portfolio items if loaded
    if (profile.portfolioItems) {
      result.portfolioItems = profile.portfolioItems.map((i: any) => ({
        id: i.id,
        creatorProfileId: i.creatorProfileId,
        title: i.title,
        description: i.description,
        mediaUrl: i.mediaUrl,
        thumbnailUrl: i.thumbnailUrl,
        externalUrl: i.externalUrl,
        category: i.category,
        platform: i.platform,
        brandName: i.brandName,
        metrics: i.metrics,
        sortOrder: i.sortOrder,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
      }));
    }

    return result;
  }
}
