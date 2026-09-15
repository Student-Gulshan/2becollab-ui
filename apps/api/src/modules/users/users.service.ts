import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        creatorProfile: true,
        businessProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() || null,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      creatorProfile: user.creatorProfile
        ? {
            ...user.creatorProfile,
            createdAt: user.creatorProfile.createdAt.toISOString(),
            updatedAt: user.creatorProfile.updatedAt.toISOString(),
          }
        : null,
      businessProfile: user.businessProfile
        ? {
            ...user.businessProfile,
            verifiedAt: user.businessProfile.verifiedAt?.toISOString() || null,
            createdAt: user.businessProfile.createdAt.toISOString(),
            updatedAt: user.businessProfile.updatedAt.toISOString(),
          }
        : null,
    };
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.fullName ? { fullName: dto.fullName } : {}),
        ...(dto.avatarUrl !== undefined ? { avatarUrl: dto.avatarUrl } : {}),
      },
      include: {
        creatorProfile: true,
        businessProfile: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() || null,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      creatorProfile: user.creatorProfile
        ? {
            ...user.creatorProfile,
            createdAt: user.creatorProfile.createdAt.toISOString(),
            updatedAt: user.creatorProfile.updatedAt.toISOString(),
          }
        : null,
      businessProfile: user.businessProfile
        ? {
            ...user.businessProfile,
            verifiedAt: user.businessProfile.verifiedAt?.toISOString() || null,
            createdAt: user.businessProfile.createdAt.toISOString(),
            updatedAt: user.businessProfile.updatedAt.toISOString(),
          }
        : null,
    };
  }
}
