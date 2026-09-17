import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsPositive,
  IsArray,
  IsOptional,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OfferDeliverableItem } from '@2becollab/types';

export class CreateOfferDto {
  @IsNotEmpty({ message: 'Recipient ID is required' })
  @IsUUID('4', { message: 'Recipient ID must be a valid UUID' })
  recipientId: string;

  @IsNotEmpty({ message: 'Creator profile ID is required' })
  @IsUUID('4', { message: 'Creator profile ID must be a valid UUID' })
  creatorProfileId: string;

  @IsOptional()
  @IsUUID('4', { message: 'Campaign ID must be a valid UUID' })
  campaignId?: string;

  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  description?: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber()
  @IsPositive({ message: 'Price must be greater than 0' })
  price: number;

  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @IsNotEmpty({ message: 'At least one deliverable is required' })
  @IsArray()
  deliverables: OfferDeliverableItem[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  revisionLimit?: number = 2;

  @IsNotEmpty({ message: 'Deadline is required' })
  @IsString()
  deadline: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  usageRights?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(365)
  exclusivityDays?: number;

  @IsOptional()
  @IsString()
  expiresAt?: string;
}
