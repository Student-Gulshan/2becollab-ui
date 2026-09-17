import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ContractStatus } from '@2becollab/types';

export class UpdateContractStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsIn([
    ContractStatus.IN_REVIEW,
    ContractStatus.COMPLETED,
    ContractStatus.DISPUTED,
    ContractStatus.CANCELLED,
  ], {
    message: 'Invalid contract status transition',
  })
  status: ContractStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;
}
