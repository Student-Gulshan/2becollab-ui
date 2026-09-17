import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  UserRole,
  CampaignApplicationResponse,
  CampaignInvitationResponse,
} from '@2becollab/types';
import { ApplicationsService } from './applications.service';
import { ApplyCampaignDto } from './dto/apply-campaign.dto';
import { InviteCreatorDto } from './dto/invite-creator.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { RespondInvitationDto } from './dto/respond-invitation.dto';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // ============================================
  // Creator Application Endpoints
  // ============================================

  @Post('campaigns/:id/apply')
  @Roles(UserRole.CREATOR)
  async applyToCampaign(
    @Param('id') campaignId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ApplyCampaignDto,
  ): Promise<CampaignApplicationResponse> {
    return this.applicationsService.applyToCampaign(campaignId, userId, dto);
  }

  @Get('creators/me/applications')
  @Roles(UserRole.CREATOR)
  async getMyApplications(
    @CurrentUser('id') userId: string,
  ): Promise<CampaignApplicationResponse[]> {
    return this.applicationsService.getCreatorApplications(userId);
  }

  @Delete('campaigns/:id/applications/withdraw')
  @Roles(UserRole.CREATOR)
  async withdrawApplication(
    @Param('id') campaignId: string,
    @CurrentUser('id') userId: string,
  ): Promise<{ success: boolean }> {
    return this.applicationsService.withdrawApplication(campaignId, userId);
  }

  // ============================================
  // Brand Review Endpoints
  // ============================================

  @Get('campaigns/:id/applications')
  @Roles(UserRole.BUSINESS)
  async getCampaignApplications(
    @Param('id') campaignId: string,
    @CurrentUser('id') userId: string,
  ): Promise<CampaignApplicationResponse[]> {
    return this.applicationsService.getCampaignApplications(campaignId, userId);
  }

  @Patch('campaigns/:id/applications/:appId/status')
  @Roles(UserRole.BUSINESS)
  async updateApplicationStatus(
    @Param('id') campaignId: string,
    @Param('appId') applicationId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateApplicationStatusDto,
  ): Promise<CampaignApplicationResponse> {
    return this.applicationsService.updateApplicationStatus(
      campaignId,
      applicationId,
      userId,
      dto,
    );
  }

  // ============================================
  // Invitations Endpoints
  // ============================================

  @Post('campaigns/invite')
  @Roles(UserRole.BUSINESS)
  async inviteCreator(
    @CurrentUser('id') userId: string,
    @Body() dto: InviteCreatorDto,
  ): Promise<CampaignInvitationResponse> {
    return this.applicationsService.inviteCreator(dto, userId);
  }

  @Get('creators/me/invitations')
  @Roles(UserRole.CREATOR)
  async getMyInvitations(
    @CurrentUser('id') userId: string,
  ): Promise<CampaignInvitationResponse[]> {
    return this.applicationsService.getCreatorInvitations(userId);
  }

  @Patch('creators/me/invitations/:id/respond')
  @Roles(UserRole.CREATOR)
  async respondToInvitation(
    @Param('id') invitationId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: RespondInvitationDto,
  ): Promise<CampaignInvitationResponse> {
    return this.applicationsService.respondToInvitation(
      invitationId,
      userId,
      dto,
    );
  }
}
