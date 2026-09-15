import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSocialAccountDto } from './dto/create-social-account.dto';
import { UpdateSocialAccountDto } from './dto/update-social-account.dto';

@Injectable()
export class SocialAccountsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get the creator profile ID for a given user, throwing if not found.
   */
  private async getCreatorProfileId(userId: string): Promise<string> {
    const profile = await this.prisma.creatorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Creator profile not found. Please create your profile first.');
    }

    return profile.id;
  }

  /**
   * List all social accounts for the authenticated creator.
   */
  async listMySocialAccounts(userId: string) {
    const creatorProfileId = await this.getCreatorProfileId(userId);

    const accounts = await this.prisma.socialAccount.findMany({
      where: { creatorProfileId },
      orderBy: { createdAt: 'asc' },
    });

    return accounts.map((a) => this.serialize(a));
  }

  /**
   * Add a new social account for the authenticated creator.
   * Enforces unique constraint: one account per platform per creator.
   */
  async addSocialAccount(userId: string, dto: CreateSocialAccountDto) {
    const creatorProfileId = await this.getCreatorProfileId(userId);

    // Check for duplicate platform
    const existing = await this.prisma.socialAccount.findUnique({
      where: {
        creatorProfileId_platform: {
          creatorProfileId,
          platform: dto.platform,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `You already have a ${dto.platform} account linked. Please edit or remove the existing one.`,
      );
    }

    const account = await this.prisma.socialAccount.create({
      data: {
        creatorProfileId,
        platform: dto.platform,
        handle: dto.handle,
        profileUrl: dto.profileUrl || null,
        followerCount: dto.followerCount ?? null,
        engagementRate: dto.engagementRate ?? null,
      },
    });

    return this.serialize(account);
  }

  /**
   * Update an existing social account. Checks ownership.
   */
  async updateSocialAccount(userId: string, accountId: string, dto: UpdateSocialAccountDto) {
    const creatorProfileId = await this.getCreatorProfileId(userId);

    const account = await this.prisma.socialAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Social account not found');
    }

    if (account.creatorProfileId !== creatorProfileId) {
      throw new ForbiddenException('You do not own this social account');
    }

    const updated = await this.prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        ...(dto.handle !== undefined ? { handle: dto.handle } : {}),
        ...(dto.profileUrl !== undefined ? { profileUrl: dto.profileUrl || null } : {}),
        ...(dto.followerCount !== undefined ? { followerCount: dto.followerCount ?? null } : {}),
        ...(dto.engagementRate !== undefined ? { engagementRate: dto.engagementRate ?? null } : {}),
      },
    });

    return this.serialize(updated);
  }

  /**
   * Delete a social account. Checks ownership.
   */
  async deleteSocialAccount(userId: string, accountId: string) {
    const creatorProfileId = await this.getCreatorProfileId(userId);

    const account = await this.prisma.socialAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Social account not found');
    }

    if (account.creatorProfileId !== creatorProfileId) {
      throw new ForbiddenException('You do not own this social account');
    }

    await this.prisma.socialAccount.delete({ where: { id: accountId } });

    return { message: 'Social account removed successfully' };
  }

  private serialize(account: any) {
    return {
      id: account.id,
      creatorProfileId: account.creatorProfileId,
      platform: account.platform,
      handle: account.handle,
      profileUrl: account.profileUrl,
      followerCount: account.followerCount,
      engagementRate: account.engagementRate,
      isVerified: account.isVerified,
      lastSyncedAt: account.lastSyncedAt?.toISOString() ?? null,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  }
}
