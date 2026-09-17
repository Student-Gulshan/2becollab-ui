import {
  IsString,
  IsEnum,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  Max,
  IsArray,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { SocialPlatform } from '@2becollab/types';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(SocialPlatform)
  platform?: SocialPlatform;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  format?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'Price must be positive' })
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(90)
  deliveryDays?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  revisions?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
