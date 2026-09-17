import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty({ message: 'Message content cannot be empty' })
  @IsString()
  @MaxLength(5000, { message: 'Message cannot exceed 5000 characters' })
  content: string;

  @IsOptional()
  attachments?: any;
}
