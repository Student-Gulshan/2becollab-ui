import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { SocialAccountsService } from './social-accounts.service';
import { CreateSocialAccountDto } from './dto/create-social-account.dto';
import { UpdateSocialAccountDto } from './dto/update-social-account.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@2becollab/types';

@Controller('creators/me/social-accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CREATOR)
export class SocialAccountsController {
  constructor(private readonly socialAccountsService: SocialAccountsService) {}

  @Get()
  async list(@CurrentUser('id') userId: string) {
    const accounts = await this.socialAccountsService.listMySocialAccounts(userId);
    return { accounts };
  }

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSocialAccountDto,
  ) {
    const account = await this.socialAccountsService.addSocialAccount(userId, dto);
    return { account, message: 'Social account added successfully' };
  }

  @Patch(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSocialAccountDto,
  ) {
    const account = await this.socialAccountsService.updateSocialAccount(userId, id, dto);
    return { account, message: 'Social account updated successfully' };
  }

  @Delete(':id')
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.socialAccountsService.deleteSocialAccount(userId, id);
  }
}
