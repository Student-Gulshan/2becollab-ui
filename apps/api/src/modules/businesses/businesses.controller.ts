import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@2becollab/types';

@Controller('businesses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get('me')
  @Roles(UserRole.BUSINESS, UserRole.ADMIN)
  async getMyProfile(@CurrentUser('id') userId: string) {
    const profile = await this.businessesService.getProfile(userId);
    return { profile };
  }

  @Patch('me')
  @Roles(UserRole.BUSINESS)
  async updateMyProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateBusinessProfileDto,
  ) {
    const profile = await this.businessesService.updateProfile(userId, dto);
    return { profile, message: 'Business profile updated successfully' };
  }

  @Public()
  @Get(':id')
  async getPublicProfile(@Param('id') id: string) {
    const profile = await this.businessesService.getPublicProfile(id);
    return { profile };
  }
}
