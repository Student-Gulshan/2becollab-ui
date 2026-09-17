import { IsNotEmpty, IsOptional, IsString, IsNumber, IsPositive, MaxLength } from 'class-validator';

export class ApplyCampaignDto {
  @IsNotEmpty({ message: 'Pitch is required' })
  @IsString()
  @MaxLength(2000, { message: 'Pitch cannot exceed 2000 characters' })
  pitch: string;

  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'Proposed rate must be positive' })
  proposedRate?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
