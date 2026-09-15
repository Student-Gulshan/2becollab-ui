import { IsString, IsOptional, IsArray, MaxLength, IsUrl, ArrayMaxSize } from 'class-validator';

export class UpdateCreatorProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  headline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  niche?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  languages?: string[];

  @IsOptional()
  @IsUrl({}, { message: 'Website must be a valid URL' })
  websiteUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Cover image must be a valid URL' })
  coverImageUrl?: string;
}
