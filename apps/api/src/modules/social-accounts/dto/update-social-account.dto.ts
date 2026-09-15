import {
  IsString,
  IsOptional,
  IsUrl,
  IsInt,
  IsNumber,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class UpdateSocialAccountDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  handle?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Profile URL must be a valid URL' })
  @MaxLength(500)
  profileUrl?: string;

  @IsOptional()
  @IsInt({ message: 'Follower count must be a whole number' })
  @Min(0)
  @Max(1_000_000_000)
  followerCount?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Engagement rate must be a number' })
  @Min(0)
  @Max(100)
  engagementRate?: number;
}
