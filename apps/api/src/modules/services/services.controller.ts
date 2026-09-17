import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, ServicePackageResponse } from '@2becollab/types';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('creators/me/services')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CREATOR)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getMyServices(
    @CurrentUser('id') userId: string,
  ): Promise<ServicePackageResponse[]> {
    return this.servicesService.getMyServices(userId);
  }

  @Post()
  async createService(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateServiceDto,
  ): Promise<ServicePackageResponse> {
    return this.servicesService.createService(userId, dto);
  }

  @Patch(':id')
  async updateService(
    @CurrentUser('id') userId: string,
    @Param('id') serviceId: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<ServicePackageResponse> {
    return this.servicesService.updateService(userId, serviceId, dto);
  }

  @Delete(':id')
  async deleteService(
    @CurrentUser('id') userId: string,
    @Param('id') serviceId: string,
  ): Promise<{ success: boolean }> {
    return this.servicesService.deleteService(userId, serviceId);
  }
}
