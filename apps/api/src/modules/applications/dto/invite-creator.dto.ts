import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class InviteCreatorDto {
  @IsNotEmpty({ message: 'Campaign ID is required' })
  @IsUUID('4', { message: 'Valid Campaign ID is required' })
  campaignId: string;

  @IsNotEmpty({ message: 'Creator Profile ID is required' })
  @IsUUID('4', { message: 'Valid Creator Profile ID is required' })
  creatorProfileId: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
