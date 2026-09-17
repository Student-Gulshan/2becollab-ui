import { IsIn, IsNotEmpty } from 'class-validator';

export class RespondOfferDto {
  @IsNotEmpty({ message: 'Action is required' })
  @IsIn(['ACCEPT', 'REJECT', 'WITHDRAW'], {
    message: 'Action must be ACCEPT, REJECT, or WITHDRAW',
  })
  action: 'ACCEPT' | 'REJECT' | 'WITHDRAW';
}
