import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@2becollab/types';

@Controller('creators/me/portfolio')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CREATOR)
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Get()
  async list(@CurrentUser('id') userId: string) {
    const items = await this.portfoliosService.listMyPortfolioItems(userId);
    return { items };
  }

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePortfolioItemDto,
  ) {
    const item = await this.portfoliosService.addPortfolioItem(userId, dto);
    return { item, message: 'Portfolio item added successfully' };
  }

  @Patch('reorder')
  async reorder(
    @CurrentUser('id') userId: string,
    @Body() body: { itemIds: string[] },
  ) {
    return this.portfoliosService.reorderPortfolioItems(userId, body.itemIds);
  }

  @Patch(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePortfolioItemDto,
  ) {
    const item = await this.portfoliosService.updatePortfolioItem(userId, id, dto);
    return { item, message: 'Portfolio item updated successfully' };
  }

  @Delete(':id')
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.portfoliosService.deletePortfolioItem(userId, id);
  }
}
