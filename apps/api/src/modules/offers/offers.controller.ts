import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CounterOfferDto } from './dto/counter-offer.dto';
import { RespondOfferDto } from './dto/respond-offer.dto';
import { OfferResponse } from '@2becollab/types';

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async getMyOffers(
    @CurrentUser('id') userId: string,
    @Query('type') type?: 'received' | 'sent',
  ): Promise<OfferResponse[]> {
    return this.offersService.getUserOffers(userId, type);
  }

  @Get(':id')
  async getOfferById(
    @Param('id') offerId: string,
    @CurrentUser('id') userId: string,
  ): Promise<OfferResponse> {
    return this.offersService.getOfferById(offerId, userId);
  }

  @Post()
  async createOffer(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateOfferDto,
  ): Promise<OfferResponse> {
    return this.offersService.createOffer(userId, dto);
  }

  @Post(':id/counter')
  async counterOffer(
    @Param('id') offerId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CounterOfferDto,
  ): Promise<OfferResponse> {
    return this.offersService.counterOffer(userId, offerId, dto);
  }

  @Patch(':id/respond')
  async respondOffer(
    @Param('id') offerId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: RespondOfferDto,
  ): Promise<{ offer: OfferResponse; contract?: any }> {
    return this.offersService.respondOffer(userId, offerId, dto.action);
  }
}
