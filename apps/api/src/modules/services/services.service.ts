import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicePackageResponse } from '@2becollab/types';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  private async getCreatorProfileOrThrow(userId: string) {
    const creator = await this.prisma.creatorProfile.findUnique({
      where: { userId },
    });
    if (!creator) {
      throw new ForbiddenException('Only creators can manage service packages');
    }
    return creator;
  }

  async getMyServices(userId: string): Promise<ServicePackageResponse[]> {
    const creator = await this.getCreatorProfileOrThrow(userId);
    const services = await this.prisma.servicePackage.findMany({
      where: { creatorProfileId: creator.id },
      orderBy: { createdAt: 'desc' },
    });

    return services.map((s: any) => ({
      id: s.id,
      creatorProfileId: s.creatorProfileId,
      title: s.title,
      description: s.description,
      platform: s.platform as any,
      format: s.format,
      price: s.price,
      currency: s.currency,
      deliveryDays: s.deliveryDays,
      revisions: s.revisions,
      features: s.features,
      isActive: s.isActive,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));
  }

  async createService(
    userId: string,
    dto: CreateServiceDto,
  ): Promise<ServicePackageResponse> {
    const creator = await this.getCreatorProfileOrThrow(userId);

    const service = await this.prisma.servicePackage.create({
      data: {
        creatorProfileId: creator.id,
        title: dto.title,
        description: dto.description,
        platform: dto.platform as any,
        format: dto.format,
        price: dto.price,
        currency: dto.currency || 'USD',
        deliveryDays: dto.deliveryDays ?? 7,
        revisions: dto.revisions ?? 1,
        features: dto.features || [],
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });

    return {
      id: service.id,
      creatorProfileId: service.creatorProfileId,
      title: service.title,
      description: service.description,
      platform: service.platform as any,
      format: service.format,
      price: service.price,
      currency: service.currency,
      deliveryDays: service.deliveryDays,
      revisions: service.revisions,
      features: service.features,
      isActive: service.isActive,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    };
  }

  async updateService(
    userId: string,
    serviceId: string,
    dto: UpdateServiceDto,
  ): Promise<ServicePackageResponse> {
    const creator = await this.getCreatorProfileOrThrow(userId);

    const existing = await this.prisma.servicePackage.findUnique({
      where: { id: serviceId },
    });

    if (!existing) {
      throw new NotFoundException('Service package not found');
    }

    if (existing.creatorProfileId !== creator.id) {
      throw new ForbiddenException('You do not own this service package');
    }

    const updated = await this.prisma.servicePackage.update({
      where: { id: serviceId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.platform !== undefined && { platform: dto.platform as any }),
        ...(dto.format !== undefined && { format: dto.format }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.currency !== undefined && { currency: dto.currency }),
        ...(dto.deliveryDays !== undefined && { deliveryDays: dto.deliveryDays }),
        ...(dto.revisions !== undefined && { revisions: dto.revisions }),
        ...(dto.features !== undefined && { features: dto.features }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });

    return {
      id: updated.id,
      creatorProfileId: updated.creatorProfileId,
      title: updated.title,
      description: updated.description,
      platform: updated.platform as any,
      format: updated.format,
      price: updated.price,
      currency: updated.currency,
      deliveryDays: updated.deliveryDays,
      revisions: updated.revisions,
      features: updated.features,
      isActive: updated.isActive,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteService(userId: string, serviceId: string): Promise<{ success: boolean }> {
    const creator = await this.getCreatorProfileOrThrow(userId);

    const existing = await this.prisma.servicePackage.findUnique({
      where: { id: serviceId },
    });

    if (!existing) {
      throw new NotFoundException('Service package not found');
    }

    if (existing.creatorProfileId !== creator.id) {
      throw new ForbiddenException('You do not own this service package');
    }

    await this.prisma.servicePackage.delete({
      where: { id: serviceId },
    });

    return { success: true };
  }
}
