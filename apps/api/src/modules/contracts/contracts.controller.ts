import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ContractsService } from './contracts.service';
import { UpdateContractStatusDto } from './dto/update-contract-status.dto';
import { ContractResponse, ContractStatus } from '@2becollab/types';

@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  async getContracts(
    @CurrentUser('id') userId: string,
    @Query('status') status?: ContractStatus,
  ): Promise<ContractResponse[]> {
    return this.contractsService.getContracts(userId, status);
  }

  @Get(':id')
  async getContractById(
    @Param('id') contractId: string,
    @CurrentUser('id') userId: string,
  ): Promise<ContractResponse> {
    return this.contractsService.getContractById(contractId, userId);
  }

  @Patch(':id/status')
  async updateContractStatus(
    @Param('id') contractId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateContractStatusDto,
  ): Promise<ContractResponse> {
    return this.contractsService.updateContractStatus(
      contractId,
      userId,
      dto.status,
    );
  }
}
