import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyCampaignDto } from './dto/apply-campaign.dto';
import { InviteCreatorDto } from './dto/invite-creator.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { RespondInvitationDto } from './dto/respond-invitation.dto';
import {
  ApplicationStatus,
  CampaignApplicationResponse,
  CampaignInvitationResponse,
} from '@2becollab/types';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  private async getCreatorProfileOrThrow(userId: string) {
    const creator = await this.prisma.creatorProfile.findUnique({
      where: { userId },
    });
    if (!creator) {
      throw new ForbiddenException('Creator profile not found. Complete your creator profile first.');
    }
    return creator;
  }

  private async getBusinessProfileOrThrow(userId: string) {
    const business = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });
    if (!business) {
      throw new ForbiddenException('Business profile not found. Complete your business profile first.');
    }
    return business;
  }

  // ============================================
  // Applications
  // ============================================

  async applyToCampaign(
    campaignId: string,
    userId: string,
    dto: ApplyCampaignDto,
  ): Promise<CampaignApplicationResponse> {
    const creator = await this.getCreatorProfileOrThrow(userId);

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.status !== 'ACTIVE') {
      throw new BadRequestException('Cannot apply to inactive campaign');
    }

    const existing = await this.prisma.campaignApplication.findUnique({
      where: {
        campaignId_creatorProfileId: {
          campaignId,
          creatorProfileId: creator.id,
        },
      },
    });

    if (existing) {
      if (existing.status === 'PENDING' || existing.status === 'ACCEPTED') {
        throw new ConflictException('You have already applied to this campaign');
      }
      // If previously rejected or withdrawn, re-apply
      const updated = await this.prisma.campaignApplication.update({
        where: { id: existing.id },
        data: {
          pitch: dto.pitch,
          proposedRate: dto.proposedRate ?? null,
          currency: dto.currency || 'USD',
          status: ApplicationStatus.PENDING,
          reviewNotes: null,
        },
      });

      return this.serializeApplication(updated);
    }

    const application = await this.prisma.campaignApplication.create({
      data: {
        campaignId,
        creatorProfileId: creator.id,
        pitch: dto.pitch,
        proposedRate: dto.proposedRate ?? null,
        currency: dto.currency || 'USD',
        status: ApplicationStatus.PENDING,
      },
    });

    return this.serializeApplication(application);
  }

  async getCampaignApplications(
    campaignId: string,
    businessUserId: string,
  ): Promise<CampaignApplicationResponse[]> {
    const business = await this.getBusinessProfileOrThrow(businessUserId);

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.businessProfileId !== business.id) {
      throw new ForbiddenException('You do not have permission to view applications for this campaign');
    }

    const apps = await this.prisma.campaignApplication.findMany({
      where: { campaignId },
      include: {
        creatorProfile: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
            socialAccounts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apps.map((a) => this.serializeApplication(a));
  }

  async getCreatorApplications(userId: string): Promise<CampaignApplicationResponse[]> {
    const creator = await this.getCreatorProfileOrThrow(userId);

    const apps = await this.prisma.campaignApplication.findMany({
      where: { creatorProfileId: creator.id },
      include: {
        campaign: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return apps.map((a) => this.serializeApplication(a));
  }

  async updateApplicationStatus(
    campaignId: string,
    applicationId: string,
    businessUserId: string,
    dto: UpdateApplicationStatusDto,
  ): Promise<CampaignApplicationResponse> {
    const business = await this.getBusinessProfileOrThrow(businessUserId);

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign || campaign.businessProfileId !== business.id) {
      throw new ForbiddenException('You do not own this campaign');
    }

    const app = await this.prisma.campaignApplication.findUnique({
      where: { id: applicationId },
    });

    if (!app || app.campaignId !== campaignId) {
      throw new NotFoundException('Application not found');
    }

    const updated = await this.prisma.campaignApplication.update({
      where: { id: applicationId },
      data: {
        status: dto.status as any,
        reviewNotes: dto.reviewNotes || null,
      },
      include: {
        creatorProfile: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
            socialAccounts: true,
          },
        },
      },
    });

    return this.serializeApplication(updated);
  }

  async withdrawApplication(
    campaignId: string,
    userId: string,
  ): Promise<{ success: boolean }> {
    const creator = await this.getCreatorProfileOrThrow(userId);

    const app = await this.prisma.campaignApplication.findUnique({
      where: {
        campaignId_creatorProfileId: {
          campaignId,
          creatorProfileId: creator.id,
        },
      },
    });

    if (!app) {
      throw new NotFoundException('Application not found');
    }

    if (app.status !== 'PENDING') {
      throw new BadRequestException('Cannot withdraw application that is not in pending status');
    }

    await this.prisma.campaignApplication.update({
      where: { id: app.id },
      data: { status: ApplicationStatus.WITHDRAWN },
    });

    return { success: true };
  }

  // ============================================
  // Invitations
  // ============================================

  async inviteCreator(
    dto: InviteCreatorDto,
    businessUserId: string,
  ): Promise<CampaignInvitationResponse> {
    const business = await this.getBusinessProfileOrThrow(businessUserId);

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: dto.campaignId },
    });

    if (!campaign || campaign.businessProfileId !== business.id) {
      throw new ForbiddenException('You do not own this campaign');
    }

    const creator = await this.prisma.creatorProfile.findUnique({
      where: { id: dto.creatorProfileId },
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    const existing = await this.prisma.campaignInvitation.findUnique({
      where: {
        campaignId_creatorProfileId: {
          campaignId: dto.campaignId,
          creatorProfileId: dto.creatorProfileId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('An invitation has already been sent to this creator');
    }

    const invitation = await this.prisma.campaignInvitation.create({
      data: {
        campaignId: dto.campaignId,
        creatorProfileId: dto.creatorProfileId,
        message: dto.message || null,
        status: 'PENDING',
      },
      include: {
        campaign: true,
      },
    });

    return {
      id: invitation.id,
      campaignId: invitation.campaignId,
      creatorProfileId: invitation.creatorProfileId,
      message: invitation.message,
      status: invitation.status as any,
      createdAt: invitation.createdAt.toISOString(),
      updatedAt: invitation.updatedAt.toISOString(),
    };
  }

  async getCreatorInvitations(userId: string): Promise<CampaignInvitationResponse[]> {
    const creator = await this.getCreatorProfileOrThrow(userId);

    const invitations = await this.prisma.campaignInvitation.findMany({
      where: { creatorProfileId: creator.id },
      include: {
        campaign: {
          include: {
            businessProfile: {
              select: {
                companyName: true,
                logoUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map((inv) => ({
      id: inv.id,
      campaignId: inv.campaignId,
      creatorProfileId: inv.creatorProfileId,
      message: inv.message,
      status: inv.status as any,
      createdAt: inv.createdAt.toISOString(),
      updatedAt: inv.updatedAt.toISOString(),
      campaign: {
        id: inv.campaign.id,
        title: inv.campaign.title,
        budgetMin: inv.campaign.budgetMin,
        budgetMax: inv.campaign.budgetMax,
        currency: inv.campaign.currency,
        deadline: inv.campaign.deadline ? inv.campaign.deadline.toISOString() : null,
        status: inv.campaign.status as any,
        business: {
          companyName: inv.campaign.businessProfile.companyName,
          logoUrl: inv.campaign.businessProfile.logoUrl,
        },
      },
    }));
  }

  async respondToInvitation(
    invitationId: string,
    userId: string,
    dto: RespondInvitationDto,
  ): Promise<CampaignInvitationResponse> {
    const creator = await this.getCreatorProfileOrThrow(userId);

    const invitation = await this.prisma.campaignInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.creatorProfileId !== creator.id) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestException('Invitation is not pending');
    }

    const updated = await this.prisma.campaignInvitation.update({
      where: { id: invitationId },
      data: { status: dto.status as any },
    });

    return {
      id: updated.id,
      campaignId: updated.campaignId,
      creatorProfileId: updated.creatorProfileId,
      message: updated.message,
      status: updated.status as any,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  private serializeApplication(app: any): CampaignApplicationResponse {
    return {
      id: app.id,
      campaignId: app.campaignId,
      creatorProfileId: app.creatorProfileId,
      pitch: app.pitch,
      proposedRate: app.proposedRate,
      currency: app.currency,
      status: app.status,
      reviewNotes: app.reviewNotes,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
      creator: app.creatorProfile
        ? {
            id: app.creatorProfile.id,
            userId: app.creatorProfile.userId,
            fullName: app.creatorProfile.user?.fullName,
            avatarUrl: app.creatorProfile.user?.avatarUrl,
            headline: app.creatorProfile.headline,
            bio: app.creatorProfile.bio,
            location: app.creatorProfile.location,
            niches: app.creatorProfile.niche,
            ratingAverage: app.creatorProfile.ratingAverage,
            reviewCount: app.creatorProfile.reviewCount,
            socialAccounts: app.creatorProfile.socialAccounts,
          }
        : undefined,
      campaign: app.campaign
        ? {
            id: app.campaign.id,
            title: app.campaign.title,
            budgetMin: app.campaign.budgetMin,
            budgetMax: app.campaign.budgetMax,
            currency: app.campaign.currency,
            deadline: app.campaign.deadline ? app.campaign.deadline.toISOString() : null,
            status: app.campaign.status,
          }
        : undefined,
    };
  }
}
