import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { FilterCampaignDto } from './dto/filter-campaign.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole, CampaignStatus } from '@2becollab/types';

@Controller('campaigns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @Roles(UserRole.BUSINESS, UserRole.ADMIN)
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCampaignDto,
  ) {
    const campaign = await this.campaignsService.create(userId, dto);
    return { campaign, message: 'Campaign created successfully' };
  }

  @Get('my')
  @Roles(UserRole.BUSINESS, UserRole.ADMIN)
  async getMyCampaigns(
    @CurrentUser('id') userId: string,
    @Query('status') status?: CampaignStatus,
  ) {
    const campaigns = await this.campaignsService.findMyCampaigns(userId, status);
    return { campaigns };
  }

  @Public()
  @Get()
  async findPublicCampaigns(@Query() query: FilterCampaignDto) {
    return this.campaignsService.findPublicCampaigns(query);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const campaign = await this.campaignsService.findOne(id);
    return { campaign };
  }

  @Patch(':id')
  @Roles(UserRole.BUSINESS, UserRole.ADMIN)
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    const campaign = await this.campaignsService.update(userId, id, dto);
    return { campaign, message: 'Campaign updated successfully' };
  }

  @Delete(':id')
  @Roles(UserRole.BUSINESS, UserRole.ADMIN)
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.campaignsService.remove(userId, id);
  }
}
