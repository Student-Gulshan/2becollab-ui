import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsArray,
  IsOptional,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { OfferDeliverableItem } from '@2becollab/types';

export class CounterOfferDto {
  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'Price must be greater than 0' })
  price?: number;

  @IsOptional()
  @IsString()
  deadline?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  revisionLimit?: number;

  @IsOptional()
  @IsArray()
  deliverables?: OfferDeliverableItem[];

  @IsNotEmpty({ message: 'Reason for counter-offer is required' })
  @IsString()
  @MaxLength(1000)
  counterReason: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  usageRights?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(365)
  exclusivityDays?: number;
}
