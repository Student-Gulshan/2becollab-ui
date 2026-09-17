import {
  IsNotEmpty,
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

export class CreateServiceDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(120)
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  @MaxLength(2000)
  description: string;

  @IsNotEmpty({ message: 'Platform is required' })
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @IsNotEmpty({ message: 'Format is required (e.g. Reel, Short, Dedicated Video)' })
  @IsString()
  @MaxLength(50)
  format: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber()
  @IsPositive({ message: 'Price must be positive' })
  price: number;

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
