import {
  IsString,
  IsOptional,
  IsEnum,
  IsUrl,
  IsObject,
  MaxLength,
} from 'class-validator';
import { SocialPlatform } from '@2becollab/types';

export class CreatePortfolioItemDto {
  @IsString()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsUrl({}, { message: 'Media URL must be a valid URL' })
  @MaxLength(500)
  mediaUrl: string;

  @IsOptional()
  @IsUrl({}, { message: 'Thumbnail URL must be a valid URL' })
  @MaxLength(500)
  thumbnailUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'External URL must be a valid URL' })
  @MaxLength(500)
  externalUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @IsOptional()
  @IsEnum(SocialPlatform)
  platform?: SocialPlatform;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  brandName?: string;

  @IsOptional()
  @IsObject()
  metrics?: Record<string, number>;
}
