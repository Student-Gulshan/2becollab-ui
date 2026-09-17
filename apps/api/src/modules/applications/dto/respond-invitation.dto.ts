import { IsNotEmpty, IsIn } from 'class-validator';
import { InvitationStatus } from '@2becollab/types';

export class RespondInvitationDto {
  @IsNotEmpty()
  @IsIn([InvitationStatus.ACCEPTED, InvitationStatus.DECLINED], {
    message: 'Status must be either ACCEPTED or DECLINED',
  })
  status: InvitationStatus.ACCEPTED | InvitationStatus.DECLINED;
}
