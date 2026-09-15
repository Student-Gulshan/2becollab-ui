import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCreatorProfileDto } from './dto/update-creator-profile.dto';
import { SearchCreatorsDto } from './dto/search-creators.dto';
import { SocialPlatform } from '@2becollab/types';

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

  async searchCreators(dto: SearchCreatorsDto) {
    const page = Math.max(1, Number(dto.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(dto.limit) || 12));
    const skip = (page - 1) * limit;

    const where: any = {
      user: {
        status: 'ACTIVE',
      },
    };

    if (dto.query?.trim()) {
      const q = dto.query.trim();
      where.OR = [
        { user: { fullName: { contains: q, mode: 'insensitive' } } },
        { headline: { contains: q, mode: 'insensitive' } },
        { bio: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (dto.niches && dto.niches.length > 0) {
      where.niche = {
        hasSome: dto.niches,
      };
    }

    if (dto.platforms && dto.platforms.length > 0) {
      where.socialAccounts = {
        some: {
          platform: { in: dto.platforms },
        },
      };
    }

    if (dto.minRating !== undefined && dto.minRating > 0) {
      where.ratingAverage = {
        gte: Number(dto.minRating),
      };
    }

    if (dto.location?.trim()) {
      where.location = {
        contains: dto.location.trim(),
        mode: 'insensitive',
      };
    }

    if (dto.minFollowers !== undefined || dto.maxFollowers !== undefined) {
      const followerFilter: any = {};
      if (dto.minFollowers !== undefined) followerFilter.gte = Number(dto.minFollowers);
      if (dto.maxFollowers !== undefined) followerFilter.lte = Number(dto.maxFollowers);

      where.socialAccounts = {
        ...(where.socialAccounts || {}),
        some: {
          ...(where.socialAccounts?.some || {}),
          followerCount: followerFilter,
        },
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (dto.sortBy === 'rating') {
      orderBy = { ratingAverage: dto.sortOrder || 'desc' };
    } else if (dto.sortBy === 'reviews') {
      orderBy = { reviewCount: dto.sortOrder || 'desc' };
    } else if (dto.sortBy === 'newest') {
      orderBy = { createdAt: dto.sortOrder || 'desc' };
    }

    const [total, profiles] = await Promise.all([
      this.prisma.creatorProfile.count({ where }),
      this.prisma.creatorProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          socialAccounts: {
            orderBy: { followerCount: 'desc' },
          },
          portfolioItems: {
            take: 3,
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              title: true,
              mediaUrl: true,
              thumbnailUrl: true,
              category: true,
              platform: true,
              brandName: true,
            },
          },
        },
      }),
    ]);

    const items = profiles.map((p) => {
      const socialAccounts = p.socialAccounts || [];
      const totalFollowers = socialAccounts.reduce(
        (sum, a) => sum + (a.followerCount || 0),
        0,
      );
      const accountsWithEr = socialAccounts.filter(
        (a) => a.engagementRate !== null && a.engagementRate !== undefined,
      );
      const avgEngagementRate =
        accountsWithEr.length > 0
          ? Number(
              (
                accountsWithEr.reduce((sum, a) => sum + (a.engagementRate || 0), 0) /
                accountsWithEr.length
              ).toFixed(1),
            )
          : null;

      return {
        id: p.id,
        userId: p.userId,
        fullName: p.user?.fullName || '',
        avatarUrl: p.user?.avatarUrl || null,
        headline: p.headline,
        bio: p.bio,
        niche: p.niche,
        location: p.location,
        languages: p.languages,
        ratingAverage: p.ratingAverage,
        reviewCount: p.reviewCount,
        isVerified: p.isVerified,
        totalFollowers,
        avgEngagementRate,
        socialAccounts: socialAccounts.map((a) => ({
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
        })),
        portfolioPreview: p.portfolioItems.map((item) => ({
          id: item.id,
          title: item.title,
          mediaUrl: item.mediaUrl,
          thumbnailUrl: item.thumbnailUrl,
          category: item.category,
          platform: item.platform,
          brandName: item.brandName,
        })),
      };
    });

    if (dto.sortBy === 'followers' || !dto.sortBy) {
      items.sort((a, b) =>
        dto.sortOrder === 'asc'
          ? a.totalFollowers - b.totalFollowers
          : b.totalFollowers - a.totalFollowers,
      );
    }

    const totalPages = Math.ceil(total / limit);

    return {
      items,
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
