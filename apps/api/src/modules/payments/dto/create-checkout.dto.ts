import { IsIn, IsOptional } from 'class-validator';

export class CreateCheckoutDto {
  @IsOptional()
  @IsIn(['CARD', 'MOCK_TEST'])
  paymentMethod?: 'CARD' | 'MOCK_TEST' = 'MOCK_TEST';
}
