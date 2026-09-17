import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class StartConversationDto {
  @IsNotEmpty({ message: 'Recipient ID is required' })
  @IsUUID('4', { message: 'Recipient ID must be a valid UUID' })
  recipientId: string;

  @IsOptional()
  @IsUUID('4', { message: 'Campaign ID must be a valid UUID' })
  campaignId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  initialMessage?: string;
}
