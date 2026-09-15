import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    let profile = await this.prisma.businessProfile.findUnique({
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
      profile = await this.prisma.businessProfile.create({
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

  async updateProfile(userId: string, dto: UpdateBusinessProfileDto) {
    // Ensure profile exists
    await this.getProfile(userId);

    const updated = await this.prisma.businessProfile.update({
      where: { userId },
      data: {
        ...(dto.companyName !== undefined ? { companyName: dto.companyName } : {}),
        ...(dto.websiteUrl !== undefined ? { websiteUrl: dto.websiteUrl || null } : {}),
        ...(dto.industry !== undefined ? { industry: dto.industry } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.companySize !== undefined ? { companySize: dto.companySize } : {}),
        ...(dto.location !== undefined ? { location: dto.location } : {}),
        ...(dto.logoUrl !== undefined ? { logoUrl: dto.logoUrl || null } : {}),
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
    const profile = await this.prisma.businessProfile.findFirst({
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
      },
    });

    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    return this.serializeProfile(profile);
  }

  private serializeProfile(profile: any) {
    return {
      id: profile.id,
      userId: profile.userId,
      companyName: profile.companyName,
      websiteUrl: profile.websiteUrl,
      industry: profile.industry,
      description: profile.description,
      companySize: profile.companySize,
      location: profile.location,
      logoUrl: profile.logoUrl,
      verifiedAt: profile.verifiedAt?.toISOString() || null,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
      user: profile.user || null,
    };
  }
}
