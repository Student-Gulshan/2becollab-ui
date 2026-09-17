import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @IsNotEmpty({ message: 'Session ID is required' })
  @IsString()
  sessionId: string;

  @IsOptional()
  @IsString()
  providerPaymentId?: string;
}
