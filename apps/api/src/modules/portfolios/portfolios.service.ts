import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';

const MAX_PORTFOLIO_ITEMS = 20;

@Injectable()
export class PortfoliosService {
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
   * List all portfolio items for the authenticated creator, sorted by sortOrder.
   */
  async listMyPortfolioItems(userId: string) {
    const creatorProfileId = await this.getCreatorProfileId(userId);

    const items = await this.prisma.portfolioItem.findMany({
      where: { creatorProfileId },
      orderBy: { sortOrder: 'asc' },
    });

    return items.map((item) => this.serialize(item));
  }

  /**
   * Add a new portfolio item. Enforces max 20 items per creator.
   */
  async addPortfolioItem(userId: string, dto: CreatePortfolioItemDto) {
    const creatorProfileId = await this.getCreatorProfileId(userId);

    // Check portfolio item count
    const currentCount = await this.prisma.portfolioItem.count({
      where: { creatorProfileId },
    });

    if (currentCount >= MAX_PORTFOLIO_ITEMS) {
      throw new BadRequestException(
        `You can have at most ${MAX_PORTFOLIO_ITEMS} portfolio items. Please remove an existing item first.`,
      );
    }

    // Auto-assign sortOrder to append at end
    const maxSort = await this.prisma.portfolioItem.findFirst({
      where: { creatorProfileId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const nextSortOrder = (maxSort?.sortOrder ?? -1) + 1;

    const item = await this.prisma.portfolioItem.create({
      data: {
        creatorProfileId,
        title: dto.title,
        description: dto.description || null,
        mediaUrl: dto.mediaUrl,
        thumbnailUrl: dto.thumbnailUrl || null,
        externalUrl: dto.externalUrl || null,
        category: dto.category || null,
        platform: dto.platform || null,
        brandName: dto.brandName || null,
        metrics: dto.metrics ?? Prisma.JsonNull,
        sortOrder: nextSortOrder,
      },
    });

    return this.serialize(item);
  }

  /**
   * Update an existing portfolio item. Checks ownership.
   */
  async updatePortfolioItem(userId: string, itemId: string, dto: UpdatePortfolioItemDto) {
    const creatorProfileId = await this.getCreatorProfileId(userId);

    const item = await this.prisma.portfolioItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Portfolio item not found');
    }

    if (item.creatorProfileId !== creatorProfileId) {
      throw new ForbiddenException('You do not own this portfolio item');
    }

    const updated = await this.prisma.portfolioItem.update({
      where: { id: itemId },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description || null } : {}),
        ...(dto.mediaUrl !== undefined ? { mediaUrl: dto.mediaUrl } : {}),
        ...(dto.thumbnailUrl !== undefined ? { thumbnailUrl: dto.thumbnailUrl || null } : {}),
        ...(dto.externalUrl !== undefined ? { externalUrl: dto.externalUrl || null } : {}),
        ...(dto.category !== undefined ? { category: dto.category || null } : {}),
        ...(dto.platform !== undefined ? { platform: dto.platform || null } : {}),
        ...(dto.brandName !== undefined ? { brandName: dto.brandName || null } : {}),
        ...(dto.metrics !== undefined ? { metrics: dto.metrics ?? Prisma.JsonNull } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });

    return this.serialize(updated);
  }

  /**
   * Delete a portfolio item. Checks ownership.
   */
  async deletePortfolioItem(userId: string, itemId: string) {
    const creatorProfileId = await this.getCreatorProfileId(userId);

    const item = await this.prisma.portfolioItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Portfolio item not found');
    }

    if (item.creatorProfileId !== creatorProfileId) {
      throw new ForbiddenException('You do not own this portfolio item');
    }

    await this.prisma.portfolioItem.delete({ where: { id: itemId } });

    return { message: 'Portfolio item removed successfully' };
  }

  /**
   * Reorder portfolio items by providing an ordered array of item IDs.
   */
  async reorderPortfolioItems(userId: string, itemIds: string[]) {
    const creatorProfileId = await this.getCreatorProfileId(userId);

    // Verify all items belong to this creator
    const items = await this.prisma.portfolioItem.findMany({
      where: { creatorProfileId },
      select: { id: true },
    });

    const ownedIds = new Set(items.map((i) => i.id));

    for (const id of itemIds) {
      if (!ownedIds.has(id)) {
        throw new ForbiddenException(`Portfolio item ${id} does not belong to you`);
      }
    }

    // Update sort orders in a transaction
    await this.prisma.$transaction(
      itemIds.map((id, index) =>
        this.prisma.portfolioItem.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );

    return { message: 'Portfolio reordered successfully' };
  }

  private serialize(item: any) {
    return {
      id: item.id,
      creatorProfileId: item.creatorProfileId,
      title: item.title,
      description: item.description,
      mediaUrl: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl,
      externalUrl: item.externalUrl,
      category: item.category,
      platform: item.platform,
      brandName: item.brandName,
      metrics: item.metrics,
      sortOrder: item.sortOrder,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }
}
