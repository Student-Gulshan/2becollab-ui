import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CreatorsService } from './creators.service';
import { UpdateCreatorProfileDto } from './dto/update-creator-profile.dto';
import { SearchCreatorsDto } from './dto/search-creators.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@2becollab/types';

@Controller('creators')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @Public()
  @Get()
  async searchCreators(@Query() query: SearchCreatorsDto) {
    return this.creatorsService.searchCreators(query);
  }

  @Get('me')
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  async getMyProfile(@CurrentUser('id') userId: string) {
    const profile = await this.creatorsService.getProfile(userId);
    return { profile };
  }

  @Patch('me')
  @Roles(UserRole.CREATOR)
  async updateMyProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCreatorProfileDto,
  ) {
    const profile = await this.creatorsService.updateProfile(userId, dto);
    return { profile, message: 'Creator profile updated successfully' };
  }

  @Public()
  @Get(':id')
  async getPublicProfile(@Param('id') id: string) {
    const profile = await this.creatorsService.getPublicProfile(id);
    return { profile };
  }
}
